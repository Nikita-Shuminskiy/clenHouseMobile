import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useOrders } from "@/src/modules/orders/hooks/useOrders";
import { OrderStatus } from "@/src/modules/orders/types/orders";

const HomeScreen: React.FC = () => {
  const { data: user } = useGetMe();
  
  // Получаем заказы в работе (assigned и in_progress)
  const { data: ordersData, isLoading: ordersLoading } = useOrders({
    status: OrderStatus.ASSIGNED,
    currierId: user?.id,
  });

  const { data: inProgressOrdersData } = useOrders({
    status: OrderStatus.IN_PROGRESS,
    currierId: user?.id,
  });

  // Объединяем заказы в работе
  const activeOrders = [
    ...(ordersData?.orders || []),
    ...(inProgressOrdersData?.orders || [])
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
        return "#FFA500";
      case OrderStatus.IN_PROGRESS:
        return "#4CAF50";
      default:
        return "#5A6E8A";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
                  {activeOrders.length} заказ{activeOrders.length === 1 ? '' : activeOrders.length < 5 ? 'а' : 'ов'}
                </Text>
              )}
            </View>

            {ordersLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#5A6E8A" />
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
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
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
                      <Text style={styles.orderPrice}>
                        {order.price} ₽
                      </Text>
                    </View>
                    
                    <Text style={styles.orderTime}>
                      📅 {new Date(order.scheduledAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
    backgroundColor: "#FAFCFE",
  },
  scrollContent: {
    paddingBottom: 34,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 32,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#5A6E8A",
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
    color: "#1A1A1A",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#F3F3F3",
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
    color: "#5A6E8A",
  },
  searchPlaceholder: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#7D8EAA",
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
    backgroundColor: "#EFF3F8",
    borderRadius: 12,
  },
  cityIcon: {
    width: 16,
    height: 16,
    color: "#5A6E8A",
  },
  cityText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#5A6E8A",
  },
  cityArrow: {
    width: 16,
    height: 16,
    color: "#5A6E8A",
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
    color: "#1A1A1A",
  },
  seeAllText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#5A6E8A",
  },
  clubsContainer: {
    gap: 16,
    paddingRight: 16,
  },
  clubCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: 280,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
  },
  clubImage: {
    height: 160,
    backgroundColor: "#EAF0F6",
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
    color: "#5A6E8A",
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
    color: "#1A1A1A",
  },
  clubLocation: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#5A6E8A",
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
    color: "#1A1A1A",
  },
  ratingLabel: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#7D8EAA",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#EFF3F8",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: {
    width: 24,
    height: 24,
    color: "#5A6E8A",
  },
  quickActionText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A1A1A",
    textAlign: "center",
  },
  // Стили для заказов
  ordersContainer: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    color: "#1A1A1A",
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
    color: "#FFFFFF",
  },
  orderDescription: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#5A6E8A",
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
    color: "#5A6E8A",
    flex: 1,
    marginRight: 8,
  },
  orderPrice: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: "#1A1A1A",
  },
  orderTime: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#7D8EAA",
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
    color: "#5A6E8A",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyStateText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#7D8EAA",
    textAlign: "center",
  },
});

export default HomeScreen;
