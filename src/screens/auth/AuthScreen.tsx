import { useSendSms } from "@/src/modules/auth/hooks/useSendSms";
import PhoneInput from "@/src/shared/components/ui-kit/phone-input";
import {
  SignInSoftFormData,
  signInSoftSchema,
} from "@/src/shared/schemas/auth-schemas";
import {
  ThemeColors,
  ThemeFonts,
  ThemeWeights,
  useTheme,
} from "@/src/shared/use-theme";
import Button from "@components/ui-kit/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../../../assets/images/logo.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SMALL_SCREEN_WIDTH = 380;

const AuthScreen: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors, sizes, fonts, weights } = useTheme();
  const { mutateAsync: signInWithSms, isPending } = useSendSms();
  const isSmallScreen = screenWidth < SMALL_SCREEN_WIDTH;

  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm<SignInSoftFormData>({
    resolver: yupResolver(signInSoftSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const phoneValue = watch("phone");
  const styles = createStyles({
    colors,
    sizes,
    fonts,
    weights,
    insets,
    isSmallScreen,
  });

  const onSubmit = async (data: SignInSoftFormData) => {
    try {
      const phoneNumber = `+7${data.phone}`;
      const res = await signInWithSms({
        phoneNumber,
        isDev: true,
      });
      console.log(res);
      router.push({
        pathname: "/(auth)/confirm-code",
        params: { phoneNumber },
      });
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Декоративный градиентный фон */}
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
        {/* Верхняя секция с логотипом */}
        <View style={styles.topSection}>
          <View style={styles.logoWrapper}>
            <Image style={styles.logoImage} source={Logo} resizeMode="contain" />
          </View>
        </View>

        {/* Карточка с формой */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.titleText}>Вход в аккаунт</Text>
            <Text style={styles.subtitleText}>
              Войдите с помощью номера телефона и кода из SMS
            </Text>
          </View>

          <View style={styles.formContent}>
            <View style={styles.inputsContainer}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    label="Номер телефона"
                    value={value}
                    onChangeText={(masked, unmasked) => onChange(unmasked)}
                    validateOnBlur={true}
                    required={true}
                  />
                )}
              />
            </View>

            <View style={styles.actionsContainer}>
              <Button
                type="primary"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending || !isValid || !phoneValue}
                isLoading={isPending}
              >
                {isPending ? "Вход..." : "Войти"}
              </Button>
            </View>
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
    },
  });

export default AuthScreen;
