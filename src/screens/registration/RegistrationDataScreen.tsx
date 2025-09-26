import { TopBar } from '@/src/shared/components/molecules/TopBar';
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  View,
  Linking,
  Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckBoxIcon,
  CheckIcon,
  InfoCircleIcon
} from "../../shared/components/icons";
import Button from "../../shared/components/ui-kit/button";
import ControlledInput from "../../shared/components/ui-kit/controlled-input";
import {
  RegistrationDataFormData,
  registrationDataSchema,
} from "../../shared/schemas/auth-schemas";
import { useTheme } from "../../shared/use-theme";
import { KeyboardScrollView } from "../auth/ui/KeyboardScrollView";

export const RegistrationDataScreen: React.FC = () => {
  const { colors, fonts, weights, sizes } = useTheme();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const styles = createStyles({ colors, fonts, weights, sizes });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationDataFormData>({
    resolver: yupResolver(registrationDataSchema) as any,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const watchedFields = watch();
  const password = watch("password");

  // Проверяем заполненность всех полей и валидность формы
  const isFormValid =
    watchedFields.name.trim() !== "" &&
    watchedFields.email.trim() !== "" &&
    watchedFields.password.trim() !== "" &&
    watchedFields.confirmPassword.trim() !== "" &&
    agreeToTerms &&
    Object.keys(errors).length === 0;

  const onSubmit = async (data: any) => {
    try {
      // await signUpWithEmail(data);
      console.log("Регистрация успешна");
      // setRegistrationData({ ...data, role: registrationData?.role });
      router.push("/(auth)/registration-role");
    } catch (error) {
      console.log("Регистрация не успешна");
      console.error("Ошибка регистрации:", error);
    }
  };

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error("Не удалось открыть ссылку:", error);
    }
  };

  // Вычисляем валидность правил пароля
  const hasMinLength = password && password.length >= 8;
  const hasDigit = password && /\d/.test(password);
  const hasUpperCase = password && /[A-ZА-Я]/.test(password);
  // partial.lemming.jefd@rapidletter.net
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Top bar */}
      <TopBar title="Регистрация" badge="2" maxBadge="3" />

      <KeyboardScrollView>
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.black }]}>
              Регистрация судовладельца
            </Text>
            <Text style={[styles.subtitle, { color: colors.grey900 }]}>
              Зарегистрируйте аккаунт и{"\n"}бронируйте яхт-клубы легко
            </Text>
          </View>

          {/* Поля формы */}
          <View style={styles.fieldsContainer}>
            <ControlledInput
              control={control}
              name="name"
              label="ФИО"
              placeholder="Введите ФИО"
              error={errors.name}
            />
            <ControlledInput
              control={control}
              name="email"
              label="Почта"
              placeholder="Введите email"
              error={errors.email}
            />

            <View style={styles.passwordContainer}>
              <ControlledInput
                control={control}
                name="password"
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                error={errors.password}
              />

              <View style={styles.validationRules}>
                <View style={styles.ruleItem}>
                  {hasMinLength ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color={String(colors.grey500)} />
                  )}
                  <Text
                    style={[
                      styles.ruleText,
                      {
                        color: hasMinLength ? "#4ADE80" : colors.grey500,
                      },
                    ]}
                  >
                    Минимум 8 символов
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  {hasDigit ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color={String(colors.grey500)} />
                  )}
                  <Text
                    style={[
                      styles.ruleText,
                      {
                        color: hasDigit ? "#4ADE80" : colors.grey500,
                      },
                    ]}
                  >
                    Используйте хотя бы одну цифру
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  {hasUpperCase ? (
                    <CheckIcon width={16} height={16} color="#4ADE80" />
                  ) : (
                    <InfoCircleIcon width={16} height={16} color={String(colors.grey500)} />
                  )}
                  <Text
                    style={[
                      styles.ruleText,
                      {
                        color: hasUpperCase ? "#4ADE80" : colors.grey500,
                      },
                    ]}
                  >
                    Используйте хотя бы одну заглавную букву
                  </Text>
                </View>
              </View>
            </View>

            <ControlledInput
              control={control}
              name="confirmPassword"
              label="Повторите пароль"
              placeholder="Введите ещё раз"
              type="password"
              error={errors.confirmPassword}
            />
          </View>

          {/* Чекбокс согласия */}
          <View style={styles.agreementContainer}>
            <Pressable
              onPress={() => {
                const newValue = !agreeToTerms;
                setAgreeToTerms(newValue);
                setValue("agreeToTerms", newValue);
              }}
            >
              {agreeToTerms ? (
                <CheckBoxIcon width={18} height={18} color={String(colors.primary500)} />
              ) : (
                <View style={styles.checkboxEmpty} />
              )}
            </Pressable>
            <View style={styles.agreementTextContainer}>
              <Text style={[styles.agreementText, { color: colors.grey900 }]}>
                Я принимаю{" "}
              </Text>
              <Pressable
                onPress={() => openLink("https://www.google.com/")}
              >
                <Text style={[styles.agreementText, styles.linkText, { color: colors.primary500 }]}>
                  Условия использования
                </Text>
              </Pressable>
              <Text style={[styles.agreementText, { color: colors.grey900 }]}>
                {" "}и{" "}
              </Text>
              <Pressable
                onPress={() => openLink("https://www.google.com/")}
              >
                <Text style={[styles.agreementText, styles.linkText, { color: colors.primary500 }]}>
                  Политику конфиденциальности
                </Text>
              </Pressable>
            </View>
          </View>


        </View>

        {/* Кнопка продолжить */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              console.log("Button pressed, agreeToTerms:", agreeToTerms);
              console.log("Form errors:", errors);
              handleSubmit(onSubmit)();
            }}
            isLoading={false}
            disabled={!isFormValid}
            style={!isFormValid ?
              { ...styles.continueButton, ...styles.disabledButton } :
              styles.continueButton
            }
          >
            Продолжить
          </Button>
        </View>
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
  colors: any;
  sizes: any;
  fonts: any;
  weights: any;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    formContainer: {
      flex: 1,
      gap: 24,
      paddingBottom: 32,
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
      textAlign: "center",
    },
    subtitle: {
      fontFamily: fonts.text2,
      fontWeight: weights.normal,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.5,
      textAlign: "center",
    },
    fieldsContainer: {
      gap: 16,
      width: "100%",
    },
    passwordContainer: {
      gap: 12,
    },
    validationRules: {
      gap: 8,
    },
    ruleItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ruleText: {
      fontFamily: fonts.text3,
      fontWeight: weights.normal,
      fontSize: 12,
      lineHeight: 16,
    },
    agreementContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginTop: 8,
    },
    checkboxEmpty: {
      width: 18,
      height: 18,
      borderRadius: 3,
      borderWidth: 1,
      borderColor: colors.grey200,
      backgroundColor: colors.grey200,
      marginTop: 3,
    },
    agreementTextContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
    },
    agreementText: {
      fontFamily: fonts.text2,
      fontWeight: weights.normal,
      fontSize: 14,
      lineHeight: 20,
    },
    linkText: {
      textDecorationLine: "underline",
    },
    buttonContainer: {
      paddingHorizontal: 8,
      paddingBottom: 8,
      marginTop: 16,
    },

    continueButton: {
      borderRadius: 16,
    },
    disabledButton: {
      backgroundColor: colors.grey100,
    },
  });

export default RegistrationDataScreen;
