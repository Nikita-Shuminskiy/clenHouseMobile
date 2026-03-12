import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "@/src/shared/components/ui-kit/button";
import { OrderStatus } from "@/src/modules/orders/types/orders";
import useTheme from "@/src/shared/use-theme/use-theme";

interface OrderCardActionsProps {
  status: OrderStatus;
  onAction?: (action: "accept" | "start" | "complete") => void;
}

const OrderCardActions: React.FC<OrderCardActionsProps> = ({ status, onAction }) => {
  const { colors } = useTheme();

  if (!onAction) return null;

  if (status === OrderStatus.PAID) {
    return (
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary500 }]}
          onPress={() => onAction("accept")}
        >
          <Text style={styles.actionText}>Принять</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === OrderStatus.ASSIGNED) {
    return (
      <View style={styles.actions}>
        <Button type="primary" onPress={() => onAction("start")} style={styles.actionButton}>
          <Text style={styles.actionText}>Начать</Text>
        </Button>
      </View>
    );
  }

  if (status === OrderStatus.IN_PROGRESS) {
    return (
      <View style={styles.actions}>
        <Button type="primary" onPress={() => onAction("complete")} style={styles.actionButton}>
          <Text style={styles.actionText}>Завершить</Text>
        </Button>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 20,
    color: "#FFFFFF",
  },
});

export default OrderCardActions;
