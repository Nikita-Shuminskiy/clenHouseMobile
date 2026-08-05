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
      <Text style={[styles.description, { color: colors.textPrimary }]} numberOfLines={2}>
        {order.description}
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Адрес:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{order.address}</Text>
      </View>

      {distance !== null && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Расстояние:</Text>
          <Text style={[styles.distanceValue, { color: colors.blue }]}>{formatDistance(distance)}</Text>
        </View>
      )}

      {order.numberPackages !== undefined && order.numberPackages > 0 && (
        <View style={[styles.packagesContainer, { backgroundColor: colors.surfaceInfo }]}>
          <Text style={styles.packagesIcon}>📦</Text>
          <Text style={[styles.packagesText, { color: colors.textPrimary }]}>
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
        <Text style={[styles.label, { color: colors.textSecondary }]}>Создан:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{formatDateString(order.createdAt)}</Text>
      </View>

      {isOverdue && order.overdueMinutes !== undefined ? (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Просрочено:</Text>
          <Text style={[styles.overdueText, { color: colors.destructive }]}>
            {formatOverdueTime(order.overdueMinutes)}
          </Text>
        </View>
      ) : order.scheduledAt ? (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Запланирован на:</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{formatDateString(order.scheduledAt)}</Text>
        </View>
      ) : null}

      {isOverdue && (
        <View style={[styles.overdueContainer, { backgroundColor: colors.destructiveLight }]}>
          <Text style={[styles.overdueLabel, { color: colors.destructive }]}>
            ⚠️ Просрочен
          </Text>
          {order.overdueMinutes !== undefined && (
            <Text style={[styles.overdueMinutes, { color: colors.destructive }]}>
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
    minWidth: 90,
  },
  value: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  distanceValue: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 16,
  },
  overdueText: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
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
    lineHeight: 16,
  },
});

export default OrderCardMeta;
