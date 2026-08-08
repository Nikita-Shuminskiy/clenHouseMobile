import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { OrderResponseDto } from "@/src/modules/orders/types/orders";
import { useTheme } from "@/src/shared/use-theme";
import OrderCardHeader from "./order-card/OrderCardHeader";
import OrderCardMeta from "./order-card/OrderCardMeta";
import OrderCardCustomer from "./order-card/OrderCardCustomer";
import OrderCardActions from "./order-card/OrderCardActions";
import { HARVEST_SHADOWS } from "@/src/shared/harvest-theme";

interface OrderCardProps {
  order: OrderResponseDto;
  onPress?: (order: OrderResponseDto) => void;
  onAction?: (order: OrderResponseDto, action: string) => void;
  distance?: number | null;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onAction,
  distance = null,
}) => {
  const { colors } = useTheme();
  const isOverdue = order.isOverdue === true;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.white },
        isOverdue && [styles.containerOverdue, { borderLeftColor: colors.destructive }],
      ]}
      onPress={() => onPress?.(order)}
      activeOpacity={0.7}
    >
      <OrderCardHeader
        id={order.id}
        status={order.status}
        price={order.price}
        isOverdue={isOverdue}
      />

      <OrderCardMeta order={order} distance={distance} />

      <View style={styles.customerBlock}>
        <OrderCardCustomer
          customer={order.customer}
          courierName={order.currier?.name}
        />
      </View>

      <OrderCardActions
        status={order.status}
        onAction={(action) => onAction?.(order, action)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    ...HARVEST_SHADOWS.card,
  },
  containerOverdue: {
    borderLeftWidth: 3,
  },
  customerBlock: {
    marginTop: 8,
  },
});

export default OrderCard;
