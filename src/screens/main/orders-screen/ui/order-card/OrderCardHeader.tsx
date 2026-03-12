import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrderStatus } from "@/src/modules/orders/types/orders";
import { formatPrice } from "@/src/shared/utils/formatting";
import { getOrderStatusUi } from "../../constants/order-status-ui";

interface OrderCardHeaderProps {
  id: string;
  status: OrderStatus;
  price: number;
  isOverdue: boolean;
}

const OrderCardHeader: React.FC<OrderCardHeaderProps> = ({
  id,
  status,
  price,
  isOverdue,
}) => {
  const statusUi = getOrderStatusUi(status);

  return (
    <View style={styles.header}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderId}>#{id.slice(-8)}</Text>
        {isOverdue && (
          <View style={styles.overdueBadge}>
            <Text style={styles.overdueBadgeText}>Просрочено</Text>
          </View>
        )}
        <View style={[styles.statusBadge, { backgroundColor: statusUi.color }]}>
          <Text style={styles.statusText}>{statusUi.label}</Text>
        </View>
      </View>
      <Text style={styles.price}>{formatPrice(price)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderId: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: "#1A1A1A",
  },
  overdueBadge: {
    backgroundColor: "#F44336",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueBadgeText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
  },
  price: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
    color: "#1A1A1A",
  },
});

export default OrderCardHeader;
