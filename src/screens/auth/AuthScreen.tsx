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
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../../assets/images/logo.png";

const AuthScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { mutateAsync: signInWithSms, isPending } = useSendSms()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSoftFormData>({
    resolver: yupResolver(signInSoftSchema),
    mode: "onSubmit", // Валидация только при отправке
    reValidateMode: "onBlur", // Перевалидация при потере фокуса
  });

  const styles = createStyles({ colors, sizes, fonts, weights });

  const onSubmit = async (data: SignInSoftFormData) => {
    try {
      // Формируем номер телефона в правильном формате
      const phoneNumber = `+7${data.phone}`;
      
      const res = await signInWithSms({
        phoneNumber: phoneNumber,
        isDev: true,
      });

      console.log(res);
      router.push({
        pathname: "/(auth)/confirm-code",
        params: { phoneNumber: phoneNumber }
      });
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  // const handleRegister = () => {
  //   router.push("/(auth)/registration-role");
  // };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Градиентный фон */}
      <LinearGradient
        colors={[
          colors.primary500,
          colors.primary400,
          colors.primary300,
          colors.primary200,
        ]}
        style={styles.gradientBackground}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Логотип и заголовок */}
      <View style={styles.headerContainer}>
        <View style={styles.logoCard}>
          <Image source={Logo} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Вход в аккаунт</Text>
          <Text style={styles.subtitleText}>
            Войдите, чтобы управлять выносом мусора{"\n"}и профилем
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentCard}>
            <View style={styles.formContent}>
              <View style={styles.inputsContainer}>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <PhoneInput
                        label="Номер телефона"
                        value={value}
                        onChangeText={(masked, unmasked) => {
                          onChange(unmasked);
                        }}
                        validateOnBlur={true}
                        required={true}
                      />
                      <Text style={{ color: colors.red }}>
                        {errors.phone?.message}
                      </Text>
                    </>
                  )}
                />
              </View>

              <View style={styles.actionsContainer}>
                <Button
                  type="primary"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}
                  isLoading={isPending}
                  containerStyle={styles.loginButton}
                >
                  {isPending ? "Вход..." : "Войти"}
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights,
}: {
  colors: ThemeColors;
  sizes: any;
  fonts: ThemeFonts;
  weights: ThemeWeights;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    headerContainer: {
      alignItems: "center",
      paddingTop: sizes.m,
      paddingBottom: sizes.m,
      paddingHorizontal: sizes.m,
      gap: sizes.m,
    },
    logoCard: {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.12)",
      borderRadius: 56,
      paddingHorizontal: 24,
      paddingVertical: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    logoText: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -1,
      fontWeight: "700",
    },
    gradientTextContainer: {
      alignSelf: "center",
    },
    gradientText: {
      alignSelf: "center",
    },
    titleContainer: {
      alignItems: "center",
      gap: sizes.s,
    },
    titleText: {
      fontFamily: fonts.h1,
      fontWeight: weights.semibold,
      fontSize: sizes.h1,
      lineHeight: 32,
      letterSpacing: -0.5,
      color: colors.white,
      textAlign: "center",
    },
    subtitleText: {
      fontFamily: fonts.text2,
      fontWeight: weights.normal,
      fontSize: sizes.text2,
      lineHeight: 24,
      letterSpacing: -0.5,
      color: colors.white,
      textAlign: "center",
    },
    mainContent: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 0,
    },
    contentCard: {
      backgroundColor: colors.background,
      borderRadius: 32,
      flex: 1,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      justifyContent: "space-between",
    },
    formContent: {
      flex: 1,
      padding: sizes.m,
      justifyContent: "space-between",
      gap: sizes.md,
    },

    inputsContainer: {
      flex: 1,
      justifyContent: "center",
      gap: sizes.sm,
    },
    passwordContainer: {
      gap: sizes.s,
    },
    inputContainer: {
      marginBottom: 0,
    },
    forgotPasswordContainer: {
      alignItems: "flex-end",
      alignSelf: "flex-end",
      paddingVertical: 12,
    },
    forgotPasswordText: {
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: sizes.text3,
      lineHeight: 20,
      color: colors.primary600,
    },
    loginButton: {
      marginTop: 0,
    },
    registerButton: {
      marginTop: sizes.s,
    },
    actionsContainer: {
      gap: sizes.m,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: sizes.s,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: colors.grey200,
    },
    dividerText: {
      fontFamily: fonts.text3,
      fontWeight: weights.normal,
      fontSize: sizes.text3,
      lineHeight: 20,
      color: colors.grey700,
    },
    socialButtonsContainer: {
      flexDirection: "row",
      gap: sizes.s,
    },
    socialButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.grey100,
      borderRadius: sizes.sm,
      paddingVertical: sizes.sm,
      paddingHorizontal: sizes.m,
      gap: sizes.s,
    },
    socialButtonText: {
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: sizes.text3,
      lineHeight: 20,
      color: colors.black,
    },
    registrationContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: sizes.s,
      paddingBottom: 34,
    },
    registrationText: {
      fontFamily: fonts.text3,
      fontWeight: weights.normal,
      fontSize: sizes.text3,
      lineHeight: 20,
      color: colors.grey700,
    },
    registrationLink: {
      fontFamily: fonts.text3,
      fontWeight: weights.medium,
      fontSize: sizes.text3,
      lineHeight: 20,
      color: colors.primary600,
    },
  });

export default AuthScreen;
