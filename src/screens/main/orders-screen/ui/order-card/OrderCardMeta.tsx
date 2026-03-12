import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrderResponseDto } from "@/src/modules/orders/types/orders";
import { formatDateString } from "@/src/shared/utils/formatting";
import { formatDistance } from "@/src/shared/utils/distance";
import { formatOverdueTime } from "@/src/shared/utils/overdueUtils";
import useTheme from "@/src/shared/use-theme/use-theme";

interface OrderCardMetaProps {
  order: OrderResponseDto;
  distance: number | null;
}

const OrderCardMeta: React.FC<OrderCardMetaProps> = ({ order, distance }) => {
  const { colors } = useTheme();
  const isOverdue = order.isOverdue === true;

  return (
    <View style={styles.content}>
      <Text style={styles.description} numberOfLines={2}>
        {order.description}
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Адрес:</Text>
        <Text style={styles.value}>{order.address}</Text>
      </View>

      {distance !== null && (
        <View style={styles.row}>
          <Text style={styles.label}>Расстояние:</Text>
          <Text style={styles.distanceValue}>{formatDistance(distance)}</Text>
        </View>
      )}

      {order.numberPackages !== undefined && order.numberPackages > 0 && (
        <View style={styles.packagesContainer}>
          <Text style={styles.packagesIcon}>📦</Text>
          <Text style={styles.packagesText}>
            {order.numberPackages}{" "}
            {order.numberPackages === 1
              ? "пакет"
              : order.numberPackages < 5
                ? "пакета"
                : "пакетов"}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Создан:</Text>
        <Text style={styles.value}>{formatDateString(order.createdAt)}</Text>
      </View>

      {isOverdue && order.overdueMinutes !== undefined ? (
        <View style={styles.row}>
          <Text style={styles.label}>Просрочено:</Text>
          <Text style={styles.overdueText}>
            {formatOverdueTime(order.overdueMinutes)}
          </Text>
        </View>
      ) : order.scheduledAt ? (
        <View style={styles.row}>
          <Text style={styles.label}>Запланирован на:</Text>
          <Text style={styles.value}>{formatDateString(order.scheduledAt)}</Text>
        </View>
      ) : null}

      {isOverdue && (
        <View style={[styles.overdueContainer, { backgroundColor: colors.error || "#FFEBEE" }]}>
          <Text style={[styles.overdueLabel, { color: colors.error || "#DC2626" }]}>
            ⚠️ Просрочен
          </Text>
          {order.overdueMinutes !== undefined && (
            <Text style={[styles.overdueMinutes, { color: colors.error || "#DC2626" }]}>
              {formatOverdueTime(order.overdueMinutes)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 8,
  },
  description: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 20,
    color: "#1A1A1A",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  label: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#5A6E8A",
    minWidth: 90,
  },
  value: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    color: "#1A1A1A",
    flex: 1,
  },
  distanceValue: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 16,
    color: "#2196F3",
  },
  overdueText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    color: "#F44336",
  },
  overdueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  overdueLabel: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
  },
  overdueMinutes: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 13,
    lineHeight: 18,
  },
  packagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  packagesIcon: {
    fontSize: 16,
  },
  packagesText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 12,
    color: "#1A1A1A",
    lineHeight: 16,
  },
});

export default OrderCardMeta;
