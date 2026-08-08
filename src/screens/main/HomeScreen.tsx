import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useOrderByLocation } from "@/src/modules/orders/hooks/useOrders";
import { OrderStatus } from "@/src/modules/orders/types/orders";
import { formatDateStringFull, formatPrice } from "@/src/shared/utils/formatting";
import * as Location from 'expo-location';
import { HARVEST_COLORS, HARVEST_SHADOWS } from "@/src/shared/harvest-theme";

const HomeScreen: React.FC = () => {
  const { data: user } = useGetMe();

  useEffect(() => {
    async function getCurrentLocation() {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      await Location.getCurrentPositionAsync({});

    }

    getCurrentLocation();
  }, []);

  // Получаем заказы в работе (assigned и in_progress)
  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrderByLocation({
    status: OrderStatus.ASSIGNED,
    currierId: user?.id,
  }, {
    enabled: !!user?.id,
  });

  const { data: inProgressOrdersData } = useOrderByLocation({
    status: OrderStatus.IN_PROGRESS,
    currierId: user?.id,
  }, {
    enabled: !!user?.id,
  });

  // Объединяем заказы в работе
  const activeOrders = [
    ...(ordersData?.orders || []),
    ...(inProgressOrdersData?.orders || []),
  ];

  const handleOrderPress = (orderId: string) => {
    router.push(`/(protected)/order-details?orderId=${orderId}`);
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.ASSIGNED:
        return "Назначен";
      case OrderStatus.IN_PROGRESS:
        return "В работе";
      default:
        return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.ASSIGNED:
        return HARVEST_COLORS.flame;
      case OrderStatus.IN_PROGRESS:
        return HARVEST_COLORS.flamePressed;
      default:
        return HARVEST_COLORS.stone;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          refetchOrders ? (
            <RefreshControl
              refreshing={ordersLoading}
              onRefresh={refetchOrders}
              colors={[HARVEST_COLORS.flame]}
              tintColor={HARVEST_COLORS.flame}
            />
          ) : undefined
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>
                Привет, {user?.name || "Гость"}!
              </Text>
              <Text style={styles.subtitle}>Давай сделаем чистоту!</Text>
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Секция активных заказов */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Заказы в работе</Text>
              {activeOrders.length > 0 && (
                <Text style={styles.seeAllText}>
                  {activeOrders.length} заказ
                  {activeOrders.length === 1
                    ? ""
                    : activeOrders.length < 5
                      ? "а"
                      : "ов"}
                </Text>
              )}
            </View>

            {ordersLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={HARVEST_COLORS.flame} />
                <Text style={styles.loadingText}>Загрузка заказов...</Text>
              </View>
            ) : activeOrders.length > 0 ? (
              <View style={styles.ordersContainer}>
                {activeOrders.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.orderCard}
                    onPress={() => handleOrderPress(order.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>#{order.id.slice(-8)}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(order.status) },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {getStatusText(order.status)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.orderDescription} numberOfLines={2}>
                      {order.description}
                    </Text>

                    <View style={styles.orderInfo}>
                      <Text style={styles.orderAddress} numberOfLines={1}>
                        📍 {order.address}
                      </Text>
                      <Text style={styles.orderPrice}>{formatPrice(order.price)}</Text>
                    </View>

                    {order.numberPackages !== undefined && order.numberPackages > 0 && (
                      <View style={styles.packagesContainer}>
                        <Text style={styles.packagesIcon}>📦</Text>
                        <Text style={styles.packagesText}>
                          {order.numberPackages} {order.numberPackages === 1 ? 'пакет' : order.numberPackages < 5 ? 'пакета' : 'пакетов'}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.orderTime}>
                      📅{" "}
                      {order.scheduledAt ? formatDateStringFull(order.scheduledAt) : "Без времени"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  У вас пока нет заказов в работе
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Новые заказы появятся здесь автоматически
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HARVEST_COLORS.canvas,
  },
  scrollContent: {
    paddingBottom: 34,
  },
  header: {
    backgroundColor: HARVEST_COLORS.paper,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    color: HARVEST_COLORS.ink,
  },
  subtitle: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.stone,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  headerIcon: {
    width: 24,
    height: 24,
    color: HARVEST_COLORS.ink,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: HARVEST_COLORS.paper,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.bone,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchIcon: {
    width: 20,
    height: 20,
    color: HARVEST_COLORS.stone,
  },
  searchPlaceholder: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.driftwood,
    flex: 1,
  },
  cityContainer: {
    alignItems: "flex-start",
  },
  cityButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: HARVEST_COLORS.softCream,
    borderRadius: 12,
  },
  cityIcon: {
    width: 16,
    height: 16,
    color: HARVEST_COLORS.stone,
  },
  cityText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.stone,
  },
  cityArrow: {
    width: 16,
    height: 16,
    color: HARVEST_COLORS.stone,
    transform: [{ rotate: "90deg" }],
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    color: HARVEST_COLORS.ink,
  },
  seeAllText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.stone,
  },
  clubsContainer: {
    gap: 16,
    paddingRight: 16,
  },
  clubCard: {
    backgroundColor: HARVEST_COLORS.paper,
    borderRadius: 20,
    width: 280,
    ...HARVEST_SHADOWS.card,
  },
  clubImage: {
    height: 160,
    backgroundColor: HARVEST_COLORS.softCream,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clubImageText: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.stone,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  clubInfo: {
    padding: 16,
    gap: 8,
  },
  clubName: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
  },
  clubLocation: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.stone,
  },
  clubRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.ink,
  },
  ratingLabel: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.driftwood,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: HARVEST_COLORS.paper,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 12,
    ...HARVEST_SHADOWS.card,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: HARVEST_COLORS.softCream,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    width: 24,
    height: 24,
    color: HARVEST_COLORS.stone,
  },
  quickActionText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.ink,
    textAlign: "center",
  },
  // Стили для заказов
  ordersContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: HARVEST_COLORS.paper,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.paper,
  },
  orderDescription: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.stone,
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderAddress: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.stone,
    flex: 1,
    marginRight: 8,
  },
  orderPrice: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
  },
  orderTime: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.driftwood,
  },
  packagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: HARVEST_COLORS.softCream,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  packagesIcon: {
    fontSize: 16,
  },
  packagesText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 12,
    color: HARVEST_COLORS.ink,
    lineHeight: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.stone,
  },
  emptyState: {
    backgroundColor: HARVEST_COLORS.paper,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: HARVEST_COLORS.mist,
    ...HARVEST_SHADOWS.card,
  },
  emptyStateText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: HARVEST_COLORS.ink,
    textAlign: "center",
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: HARVEST_COLORS.driftwood,
    textAlign: "center",
  },
});

export default HomeScreen;
