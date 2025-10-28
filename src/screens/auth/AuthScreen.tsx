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
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../../../assets/images/logo.png";

const AuthScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const { mutateAsync: signInWithSms, isPending } = useSendSms();

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
  const styles = createStyles({ colors, sizes, fonts, weights });

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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={[colors.grey700, colors.grey500, colors.grey300]}
        style={styles.gradientBackground}
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
        <View style={styles.headerContainer}>
          <View style={styles.logoCard}>
            <Image style={styles.logoImage} source={Logo} resizeMode="contain" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Вход в аккаунт</Text>
            <Text style={styles.subtitleText}>
              Войдите, чтобы управлять выносом мусора и профилем
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
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
      </KeyboardAwareScrollView>
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
    },
    headerContainer: {
      alignItems: "center",
      paddingTop: sizes.xxl,
      paddingBottom: sizes.xl,
      paddingHorizontal: sizes.m,
      gap: sizes.l,
    },
    logoCard: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      borderRadius: 24,
      padding: sizes.md,
      justifyContent: "center",
      alignItems: "center",
    },
    logoImage: {
      width: 100,
      height: 100,
    },
    titleContainer: {
      alignItems: "center",
      gap: sizes.s,
      paddingHorizontal: sizes.m,
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
      lineHeight: 22,
      letterSpacing: -0.3,
      color: colors.white,
      textAlign: "center",
      opacity: 0.95,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 50,
    },
    formCard: {
      flex: 1,

      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: sizes.l,
      paddingTop: sizes.xl,

      gap: sizes.xl,
      marginTop: sizes.xl,
      minHeight: "100%",

    },
    inputsContainer: {
      gap: sizes.sm,
    },
    actionsContainer: {
      paddingTop: sizes.s,
    },
  });

export default AuthScreen;
