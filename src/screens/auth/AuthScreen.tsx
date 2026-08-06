import { useLoginByEmail } from "@/src/modules/auth/hooks/useLoginByEmail";
import ControlledInput from "@/src/shared/components/ui-kit/controlled-input";
import {
  SignInEmailFormData,
  signInEmailSchema,
} from "@/src/shared/schemas/auth-schemas";
import {
  ThemeColors,
  ThemeFonts,
  ThemeWeights,
  useTheme,
} from "@/src/shared/use-theme";
import {
  getSavedAuthCredentials,
  SavedAuthCredentials,
} from "@/src/modules/auth/utils/saved-auth";
import Button from "@components/ui-kit/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React from "react";
import { toast } from "sonner-native";
import { useForm } from "react-hook-form";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../../../assets/images/logo.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SMALL_SCREEN_WIDTH = 380;

const getQuickLoginLabel = (login: string): string => {
  const trimmed = login.trim();
  if (trimmed.length <= 24) {
    return trimmed;
  }
  return `${trimmed.slice(0, 21)}...`;
};

const AuthScreen: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors, sizes, fonts, weights } = useTheme();
  const { mutateAsync: signInWithEmail, isPending: isEmailPending } =
    useLoginByEmail();
  const [savedCredentials, setSavedCredentials] =
    React.useState<SavedAuthCredentials | null>(null);
  const [isCourierMode, setIsCourierMode] = React.useState(false);
  const isSmallScreen = screenWidth < SMALL_SCREEN_WIDTH;

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { isValid: isEmailValid },
    watch: watchEmail,
    setValue: setEmailValue,
  } = useForm<SignInEmailFormData>({
    resolver: yupResolver(signInEmailSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedEmail = watchEmail("email");
  const watchedPassword = watchEmail("password");
  const isQuickLoginPending = isEmailPending;
  const styles = createStyles({
    colors,
    sizes,
    fonts,
    weights,
    insets,
    isSmallScreen,
  });

  const onEmailSubmit = async (data: SignInEmailFormData) => {
    try {
      await signInWithEmail({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });
    } catch (error) {
      console.error("Ошибка входа по email:", error);
    }
  };

  React.useEffect(() => {
    const loadSavedCredentials = async () => {
      const saved = await getSavedAuthCredentials();
      setSavedCredentials(saved);
    };

    loadSavedCredentials();
  }, []);

  const handleQuickLogin = async () => {
    if (!savedCredentials || isQuickLoginPending) {
      return;
    }

    if (savedCredentials.method !== "email") {
      toast.error("Вход по телефону отключен", {
        description: "Используйте вход по email и паролю.",
        duration: 5000,
      });
      return;
    }

    if (!savedCredentials.password) {
      toast.error("Быстрый вход недоступен", {
        description:
          "Для email входа нужен сохраненный пароль. Войдите вручную один раз.",
        duration: 5000,
      });
      return;
    }

    setEmailValue("email", savedCredentials.login);
    setEmailValue("password", savedCredentials.password);

    await onEmailSubmit({
      email: savedCredentials.login,
      password: savedCredentials.password,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={[colors.primary500, colors.primary400, colors.primary300]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
      >
        <View style={styles.topSection}>
          <View style={styles.logoWrapper}>
            <Image style={styles.logoImage} source={Logo} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.eyebrowText}>
              {isCourierMode ? "Режим курьера" : "Для клиентов"}
            </Text>
            <Text style={styles.titleText}>
              {isCourierMode ? "Вход курьера" : "Вход клиента"}
            </Text>
            <Text style={styles.subtitleText}>
              {isCourierMode
                ? "Введите рабочий email и пароль курьера"
                : "Создавайте заказы, оплачивайте и управляйте подпиской"}
            </Text>
          </View>

          <View style={styles.formContent}>
            <View style={styles.inputsContainer}>
              <ControlledInput
                control={emailControl}
                name="email"
                label="Email"
                placeholder="Введите email"
                type="mail"
              />
              <ControlledInput
                control={emailControl}
                name="password"
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
              />
            </View>

            <View style={styles.actionsContainer}>
              <Button
                type="primary"
                onPress={handleEmailSubmit(onEmailSubmit)}
                disabled={
                  isEmailPending || !isEmailValid || !watchedEmail || !watchedPassword
                }
                isLoading={isEmailPending}
              >
                {isEmailPending ? "Вход..." : "Войти"}
              </Button>
              {savedCredentials?.method === "email" && (
                <Button
                  type="secondary"
                  onPress={handleQuickLogin}
                  disabled={isQuickLoginPending}
                >
                  {`Войти как ${getQuickLoginLabel(savedCredentials.login)}`}
                </Button>
              )}
              {/* Вход по SMS отключен. Главный метод: email + пароль. */}
              <Button
                type="text"
                onPress={() => router.push("/(auth)/registration-profile")}
                containerStyle={styles.registerButton}
                textStyle={styles.registerButtonText}
              >
                Создать аккаунт клиента
              </Button>
            </View>
          </View>

          <View style={styles.roleSwitchContainer}>
            <Pressable
              onPress={() => setIsCourierMode((value) => !value)}
              style={({ pressed }) => [
                styles.roleSwitchButton,
                pressed && styles.roleSwitchButtonPressed,
              ]}
            >
              <Text style={styles.roleSwitchText}>
                {isCourierMode
                  ? "Вернуться ко входу клиента"
                  : "Вход для курьера"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights,
  insets,
  isSmallScreen,
}: {
  colors: ThemeColors;
  sizes: any;
  fonts: ThemeFonts;
  weights: ThemeWeights;
  insets: { top: number; bottom: number };
  isSmallScreen: boolean;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    backgroundGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "45%",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "space-between",
    },
    topSection: {
      paddingTop: sizes.xxl + Math.max(insets.top, 0),
      paddingBottom: isSmallScreen ? sizes.m : sizes.xl,
      alignItems: "center",
      justifyContent: "center",
      minHeight: isSmallScreen ? 120 : 200,
    },
    logoWrapper: {
      width: isSmallScreen ? 90 : 140,
      height: isSmallScreen ? 90 : 140,
      borderRadius: isSmallScreen ? 45 : 70,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    logoImage: {
      width: isSmallScreen ? 64 : 100,
      height: isSmallScreen ? 64 : 100,
    },
    formCard: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      marginTop: isSmallScreen ? sizes.m : sizes.xl,
      ...(isSmallScreen ? { flexGrow: 1 } : { height: "100%" }),
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: -8,
      },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 12,
    },
    formHeader: {
      paddingTop: isSmallScreen ? sizes.l : sizes.xxl,
      paddingHorizontal: sizes.xl,
      paddingBottom: sizes.l,
      alignItems: "center",
      gap: sizes.s,
    },
    titleText: {
      fontFamily: fonts.h1,
      fontWeight: weights.bold,
      fontSize: isSmallScreen ? 24 : sizes.h1 || 32,
      lineHeight: isSmallScreen ? 30 : 40,
      letterSpacing: -0.8,
      color: colors.grey900,
      textAlign: "center",
    },
    eyebrowText: {
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: 13,
      lineHeight: 18,
      color: colors.primary500,
      textAlign: "center",
      textTransform: "uppercase",
    },
    subtitleText: {
      fontFamily: fonts.text2,
      fontWeight: weights.normal,
      fontSize: sizes.text2 || 16,
      lineHeight: 24,
      letterSpacing: -0.2,
      color: colors.grey600,
      textAlign: "center",
      paddingHorizontal: sizes.m,
    },
    formContent: {
      paddingHorizontal: sizes.xl,
      paddingBottom: insets.bottom,
      gap: sizes.xl,
    },
    inputsContainer: {
      gap: sizes.md,
    },
    actionsContainer: {
      paddingTop: sizes.md,
      gap: sizes.s,
    },
    registerButton: {
      alignSelf: "center",
    },
    registerButtonText: {
      color: colors.primary500,
    },
    roleSwitchContainer: {
      paddingHorizontal: sizes.xl,
      paddingBottom: Math.max(insets.bottom, sizes.m) + sizes.m,
      alignItems: "center",
    },
    roleSwitchButton: {
      minHeight: 44,
      paddingHorizontal: 18,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.white,
    },
    roleSwitchButtonPressed: {
      opacity: 0.7,
    },
    roleSwitchText: {
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: 14,
      lineHeight: 20,
      color: colors.grey700,
    },
  });

export default AuthScreen;
