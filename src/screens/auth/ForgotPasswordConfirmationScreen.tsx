import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useResetPasswordRequest } from "@/src/modules/auth/api/use-reset-password-request";
import { useVerifyResetCode } from "@/src/modules/auth/api/use-verify-reset-code";
import { PenIcon } from "@/src/shared/components/icons";
import Button from "@/src/shared/components/ui-kit/button";
import ControlledInput from "@/src/shared/components/ui-kit/controlled-input";
import {
  VerifyResetCodeFormData,
  verifyResetCodeSchema,
} from "@/src/shared/schemas/auth-schemas";
import {
  ThemeColors,
  ThemeFonts,
  ThemeWeights,
  useTheme,
} from "@/src/shared/use-theme";
import { TopBar } from "../../shared/components/molecules/TopBar";
import { KeyboardScrollView } from "./ui/KeyboardScrollView";

const ForgotPasswordConfirmationScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [codeError, setCodeError] = useState<string>("");
  const [isResending, setIsResending] = useState(false);

  const { mutateAsync: verifyResetCode, isPending } = useVerifyResetCode();
  const { mutateAsync: resendCode } = useResetPasswordRequest();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VerifyResetCodeFormData>({
    resolver: yupResolver(verifyResetCodeSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      email: email || "",
      code: "",
    },
  });

  const styles = createStyles({ colors, sizes, fonts, weights });

  const handleEditEmail = () => {
    router.back();
  };

  const onSubmit = async (data: VerifyResetCodeFormData) => {
    // Просто переходим на экран сброса пароля
    // Проверка кода будет происходить при самом сбросе пароля
    router.push({
      pathname: "/(auth)/(reset-password)/reset-password" as any,
      params: { email: data.email, code: data.code },
    });
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      await resendCode({ email });
      setCodeError("");
    } catch (error) {
      console.error("Ошибка при повторной отправке кода:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Top bar */}
      <TopBar title="Восстановление доступа" />

      <KeyboardScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.iconContainer} />
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Проверьте вашу почту</Text>
            <Text style={styles.subtitle}>
              Мы отправили письмо с инструкцией{"\n"} по восстановлению доступа
              на
            </Text>
          </View>

          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>{email}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditEmail}
            >
              <View style={styles.editIconContainer}>
                <PenIcon color={colors.grey500} />
              </View>
            </TouchableOpacity>
          </View>
          <ControlledInput
            control={control}
            name="code"
            type="base"
            label="Код подтверждения"
            placeholder="Введите код из письма"
            error={
              errors.code ||
              (codeError ? { message: codeError, type: "manual" } : undefined)
            }
          />

          {codeError && (
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Не получили код?</Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResending}
                style={styles.resendButton}
              >
                <Text
                  style={[
                    styles.resendButtonText,
                    isResending && styles.resendButtonTextDisabled,
                  ]}
                >
                  {isResending ? "Отправка..." : "Отправить повторно"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Button
          type="primary"
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          isLoading={isPending}
          containerStyle={styles.continueButton}
        >
          {isPending ? "Проверка..." : "Подтвердить"}
        </Button>
      </KeyboardScrollView>
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
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 24,
      gap: 24,
    },
    mainContainer: {
      alignItems: "center",
      gap: 16,
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.grey100,
      borderRadius: 32,
      width: 240,
      height: 240,
    },
    headerContainer: {
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontFamily: fonts.h2,
      fontWeight: weights.medium,
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: -0.5,
      color: colors.black,
      textAlign: "center",
    },
    subtitle: {
      fontFamily: fonts.text2,
      fontWeight: weights.normal,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.5,
      color: colors.grey900,
      textAlign: "center",
    },
    emailContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      backgroundColor: colors.grey100,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    emailText: {
      fontFamily: fonts.text2,
      fontWeight: weights.medium,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.5,
      color: colors.primary600,
      textAlign: "center",
    },
    editButton: {
      padding: 2,
    },
    editIconContainer: {
      backgroundColor: "transparent",
      borderRadius: 32,
      padding: 2,
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    continueButton: {
      marginTop: 24,
      borderRadius: 16,
    },
    resendContainer: {
      marginTop: 12,
      alignItems: "center",
      gap: 8,
    },
    resendText: {
      fontFamily: fonts.text2,
      fontWeight: weights.normal,
      fontSize: 14,
      lineHeight: 20,
      color: colors.grey900,
      textAlign: "center",
    },
    resendButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    resendButtonText: {
      fontFamily: fonts.text2,
      fontWeight: weights.medium,
      fontSize: 14,
      lineHeight: 20,
      color: colors.primary600,
      textAlign: "center",
    },
    resendButtonTextDisabled: {
      color: colors.grey500,
    },
  });

export default ForgotPasswordConfirmationScreen;
