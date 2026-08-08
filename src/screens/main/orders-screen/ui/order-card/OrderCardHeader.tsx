import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrderStatus } from "@/src/modules/orders/types/orders";
import { formatPrice } from "@/src/shared/utils/formatting";
import { useTheme } from "@/src/shared/use-theme";
import { getOrderStatusUi } from "../../constants/order-status-ui";
import { HARVEST_COLORS } from "@/src/shared/harvest-theme";

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
  const { colors } = useTheme();
  const statusUi = getOrderStatusUi(status);

  return (
    <View style={styles.header}>
      <View style={styles.orderInfo}>
        <Text style={[styles.orderId, { color: colors.textPrimary }]}>#{id.slice(-8)}</Text>
        {isOverdue && (
          <View style={[styles.overdueBadge, { backgroundColor: colors.destructive }]}>
            <Text style={styles.overdueBadgeText}>Просрочено</Text>
          </View>
        )}
        <View style={[styles.statusBadge, { backgroundColor: statusUi.color }]}>
          <Text style={styles.statusText}>{statusUi.label}</Text>
        </View>
      </View>
      <Text style={[styles.price, { color: colors.textPrimary }]}>{formatPrice(price)}</Text>
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
  },
  overdueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueBadgeText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: HARVEST_COLORS.paper,
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
    color: HARVEST_COLORS.paper,
  },
  price: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 24,
  },
});

export default OrderCardHeader;
