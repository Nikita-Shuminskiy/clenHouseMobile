import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "sonner-native";

import {
  usePaymentStatus,
  useRefreshCustomerData,
} from "@/src/modules/customer/hooks";
import { PrimaryButton } from "@/src/screens/client/components/ClientUI";

const successStatuses = ["paid", "success"];
const failedStatuses = ["failed", "canceled", "refunded"];

const colors = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  ink: "#1F1F1F",
  muted: "#777777",
  line: "#E8E1DC",
  primary: "#FF5E00",
  success: "#18A05E",
  danger: "#D92D20",
};

const PaymentResultScreen = () => {
  const params = useLocalSearchParams<{
    paymentId?: string;
    type?: "order" | "subscription";
    orderId?: string;
    subscriptionId?: string;
  }>();
  const paymentId = typeof params.paymentId === "string" ? params.paymentId : "";
  const paymentType = params.type === "subscription" ? "subscription" : "order";
  const orderId = typeof params.orderId === "string" ? params.orderId : "";
  const refreshCustomerData = useRefreshCustomerData();
  const paymentStatus = usePaymentStatus(paymentId, !!paymentId);
  const status = paymentStatus.data?.status;
  const isSuccess = !!status && successStatuses.includes(status);
  const isFailed = !!status && failedStatuses.includes(status);

  React.useEffect(() => {
    if (!isSuccess) return;

    refreshCustomerData();
    toast.success(
      paymentType === "subscription" ? "Подписка оплачена" : "Заказ оплачен",
    );
  }, [isSuccess, paymentType, refreshCustomerData]);

  const goToTarget = () => {
    if (paymentType === "subscription") {
      router.replace("/(client-tabs)/subscription");
      return;
    }

    if (orderId) {
      router.replace({
        pathname: "/(client)/order-details",
        params: { orderId },
      } as any);
      return;
    }

    router.replace("/(client-tabs)/orders" as any);
  };

  if (!paymentId) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Не удалось проверить оплату</Text>
          <Text style={styles.text}>
            Вернитесь в приложение и обновите статус заказа.
          </Text>
          <PrimaryButton onPress={() => router.replace("/(client-tabs)/orders" as any)}>
            К заказам
          </PrimaryButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {!status && (
          <>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.title}>Проверяем оплату</Text>
            <Text style={styles.text}>Это займет несколько секунд.</Text>
          </>
        )}

        {isSuccess && (
          <>
            <View style={[styles.statusDot, styles.successDot]} />
            <Text style={styles.title}>
              {paymentType === "subscription" ? "Подписка оплачена" : "Заказ оплачен"}
            </Text>
            <Text style={styles.text}>Можно вернуться обратно в приложение.</Text>
            <PrimaryButton onPress={goToTarget}>
              {paymentType === "subscription" ? "К подписке" : "К заказу"}
            </PrimaryButton>
          </>
        )}

        {isFailed && (
          <>
            <View style={[styles.statusDot, styles.failDot]} />
            <Text style={styles.title}>Платеж не завершен</Text>
            <Text style={styles.text}>Можно вернуться и попробовать оплатить еще раз.</Text>
            <PrimaryButton onPress={goToTarget}>Вернуться</PrimaryButton>
          </>
        )}

        {!!status && !isSuccess && !isFailed && (
          <>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.title}>Платеж обрабатывается</Text>
            <Text style={styles.text}>Статус обновится автоматически.</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  card: {
    gap: 14,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  statusDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  successDot: {
    backgroundColor: colors.success,
  },
  failDot: {
    backgroundColor: colors.danger,
  },
  title: {
    fontFamily: "Onest",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: colors.ink,
  },
  text: {
    fontFamily: "Onest",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: colors.muted,
  },
});

export default PaymentResultScreen;
