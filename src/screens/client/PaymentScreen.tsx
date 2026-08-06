import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { toast } from "sonner-native";
import {
  openExternalPayment,
  usePaymentStatus,
  useRefreshCustomerData,
} from "@/src/modules/customer/hooks";
import {
  Card,
  CLIENT_COLORS,
  ClientScreen,
  PrimaryButton,
  StatusPill,
} from "./components/ClientUI";

const terminalSuccess = ["paid", "success"];
const terminalFail = ["failed", "canceled", "refunded"];

const PaymentScreen = () => {
  const params = useLocalSearchParams<{
    paymentId?: string;
    paymentUrl?: string;
    type?: "order" | "subscription";
    orderId?: string;
  }>();
  const paymentId = typeof params.paymentId === "string" ? params.paymentId : "";
  const paymentUrl = typeof params.paymentUrl === "string" ? params.paymentUrl : "";
  const paymentType = params.type === "subscription" ? "subscription" : "order";
  const refreshCustomerData = useRefreshCustomerData();
  const paymentStatus = usePaymentStatus(paymentId, !!paymentId);
  const status = paymentStatus.data?.status;

  React.useEffect(() => {
    if (!status) return;
    if (terminalSuccess.includes(status)) {
      refreshCustomerData();
      toast.success(
        paymentType === "subscription" ? "Подписка оплачена" : "Заказ оплачен",
      );
      router.replace(
        paymentType === "subscription"
          ? "/(client-tabs)/subscription"
          : "/(client-tabs)/orders" as any,
      );
    }

    if (terminalFail.includes(status)) {
      toast.error("Платеж не завершен", {
        description: "Можно попробовать оплатить еще раз.",
      });
    }
  }, [paymentType, refreshCustomerData, status]);

  if (!paymentUrl || !paymentId) {
    return (
      <ClientScreen title="Оплата" subtitle="Не хватает данных платежа">
        <View style={styles.content}>
          <Card style={styles.center}>
            <Text style={styles.title}>Ссылка на оплату недоступна</Text>
            <PrimaryButton onPress={() => router.back()}>
              Вернуться назад
            </PrimaryButton>
          </Card>
        </View>
      </ClientScreen>
    );
  }

  return (
    <ClientScreen
      title="Оплата"
      subtitle={paymentType === "subscription" ? "Оплата подписки" : "Оплата заказа"}
      right={
        status ? (
          <StatusPill
            label={status}
            tone={terminalSuccess.includes(status) ? "success" : terminalFail.includes(status) ? "danger" : "warning"}
          />
        ) : null
      }
    >
      <View style={styles.webviewWrap}>
        <WebView
          source={{ uri: paymentUrl }}
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          onNavigationStateChange={(event) => {
            if (
              event.url.includes("payment/result") ||
              event.url.includes("payment-return")
            ) {
              paymentStatus.refetch();
            }
          }}
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator color={CLIENT_COLORS.primary} />
            </View>
          )}
          onError={() => {
            toast.error("Не удалось загрузить оплату", {
              description: "Откройте оплату во внешнем браузере.",
            });
          }}
        />
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          variant="secondary"
          onPress={() => openExternalPayment(paymentUrl)}
        >
          Открыть в браузере
        </PrimaryButton>
        <PrimaryButton variant="ghost" onPress={() => paymentStatus.refetch()}>
          Проверить статус
        </PrimaryButton>
      </View>
    </ClientScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  center: {
    gap: 14,
    alignItems: "center",
  },
  title: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 18,
    color: CLIENT_COLORS.ink,
  },
  webviewWrap: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 10,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
    backgroundColor: "#FFFFFF",
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 26,
    gap: 10,
  },
});

export default PaymentScreen;
