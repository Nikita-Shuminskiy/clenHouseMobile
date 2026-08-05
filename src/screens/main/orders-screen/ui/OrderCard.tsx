import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { OrderResponseDto } from "@/src/modules/orders/types/orders";
import { useTheme } from "@/src/shared/use-theme";
import OrderCardHeader from "./order-card/OrderCardHeader";
import OrderCardMeta from "./order-card/OrderCardMeta";
import OrderCardCustomer from "./order-card/OrderCardCustomer";
import OrderCardActions from "./order-card/OrderCardActions";

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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  containerOverdue: {
    borderLeftWidth: 3,
  },
  customerBlock: {
    marginTop: 8,
  },
});

export default OrderCard;
