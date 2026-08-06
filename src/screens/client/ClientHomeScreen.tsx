import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import {
  useCustomerOrders,
  useCustomerSubscription,
} from "@/src/modules/customer/hooks";
import { SubscriptionStatus } from "@/src/modules/customer/types";
import {
  Card,
  CLIENT_COLORS,
  ClientScreen,
  EmptyState,
  PrimaryButton,
  SectionTitle,
  StatusPill,
} from "./components/ClientUI";
import { OrderSummaryCard } from "./components/OrderSummaryCard";

const ClientHomeScreen = () => {
  const { data: user } = useGetMe();
  const { data: orders, isLoading: isOrdersLoading } = useCustomerOrders();
  const { data: subscription, isLoading: isSubscriptionLoading } =
    useCustomerSubscription();
  const latestOrders = (orders ?? []).slice(0, 3);
  const hasActiveSubscription = subscription?.status === SubscriptionStatus.ACTIVE;

  return (
    <ClientScreen
      title={`Здравствуйте${user?.name ? `, ${user.name}` : ""}`}
      subtitle="Заказы, оплата и подписка в одном приложении"
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.hero}>
          <Text style={styles.heroTitle}>Вывоз мусора без звонков</Text>
          <Text style={styles.heroText}>
            Укажите адрес, количество пакетов и удобное время. Оплата работает
            через YooKassa.
          </Text>
          <PrimaryButton onPress={() => router.push("/(client)/create-order" as any)}>
            Создать заказ
          </PrimaryButton>
        </Card>

        <Card style={styles.subscriptionCard}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.cardLabel}>Подписка</Text>
              {isSubscriptionLoading ? (
                <ActivityIndicator color={CLIENT_COLORS.primary} />
              ) : subscription ? (
                <>
                  <Text style={styles.cardTitle}>
                    {hasActiveSubscription ? "Активна" : "Ожидает оплаты"}
                  </Text>
                  <Text style={styles.cardText}>
                    {subscription.ordersLimit === -1
                      ? "Безлимитные заказы"
                      : `${subscription.usedOrders ?? 0}/${subscription.ordersLimit ?? 0} заказов`}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle}>Нет активной подписки</Text>
                  <Text style={styles.cardText}>
                    Можно оплачивать разово или выбрать тариф.
                  </Text>
                </>
              )}
            </View>
            <StatusPill
              label={hasActiveSubscription ? "active" : "online"}
              tone={hasActiveSubscription ? "success" : "warning"}
            />
          </View>
          <PrimaryButton
            variant="secondary"
            onPress={() => router.push("/(client-tabs)/subscription" as any)}
          >
            Перейти к тарифам
          </PrimaryButton>
        </Card>

        <View>
          <View style={styles.sectionHeader}>
            <SectionTitle>Последние заказы</SectionTitle>
            <Text
              style={styles.link}
              onPress={() => router.push("/(client-tabs)/orders" as any)}
            >
              Все
            </Text>
          </View>
          {isOrdersLoading ? (
            <ActivityIndicator color={CLIENT_COLORS.primary} />
          ) : latestOrders.length ? (
            <View style={styles.list}>
              {latestOrders.map((order) => (
                <OrderSummaryCard
                  key={order.id}
                  order={order}
                  onPress={() =>
                    router.push({
                      pathname: "/(client)/order-details",
                      params: { orderId: order.id },
                    } as any)
                  }
                />
              ))}
            </View>
          ) : (
            <EmptyState
              title="Заказов пока нет"
              text="Первый заказ можно создать за пару минут."
            />
          )}
        </View>
      </ScrollView>
    </ClientScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 110,
    gap: 14,
  },
  hero: {
    gap: 12,
    backgroundColor: "#FFF7EF",
    borderColor: "#F4DAC8",
  },
  heroTitle: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 23,
    lineHeight: 29,
    color: CLIENT_COLORS.ink,
  },
  heroText: {
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: CLIENT_COLORS.muted,
  },
  subscriptionCard: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 12,
    color: CLIENT_COLORS.accent,
    textTransform: "uppercase",
  },
  cardTitle: {
    marginTop: 4,
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 17,
    color: CLIENT_COLORS.ink,
  },
  cardText: {
    marginTop: 4,
    fontFamily: "Onest",
    fontSize: 14,
    lineHeight: 20,
    color: CLIENT_COLORS.muted,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  link: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 14,
    color: CLIENT_COLORS.primary,
  },
  list: {
    gap: 12,
  },
});

export default ClientHomeScreen;
