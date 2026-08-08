import React, { useCallback } from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserDto } from "@/src/modules/orders/types/orders";
import { useTheme } from "@/src/shared/use-theme";

interface OrderCardCustomerProps {
  customer: UserDto;
  courierName?: string | null;
}

const OrderCardCustomer: React.FC<OrderCardCustomerProps> = ({
  customer,
  courierName,
}) => {
  const { colors } = useTheme();
  const openLink = useCallback(async (url: string, errorText: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Ошибка", errorText);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Ошибка", errorText);
    }
  }, []);

  const handlePhonePress = useCallback(
    () => openLink(`tel:${customer.phone.replace(/[\s()\-]/g, "")}`, "Не удалось открыть приложение для звонков"),
    [customer.phone, openLink]
  );

  const handleTelegramPress = useCallback(() => {
    if (!customer.telegramUsername) return;
    openLink(`https://t.me/${customer.telegramUsername}`, "Не удалось открыть Telegram");
  }, [customer.telegramUsername, openLink]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Клиент:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{customer.name}</Text>
        <TouchableOpacity onPress={handlePhonePress} activeOpacity={0.7}>
          <Text style={[styles.phone, { color: colors.textSecondary }]}>{customer.phone}</Text>
        </TouchableOpacity>
        {customer.telegramUsername && (
          <TouchableOpacity onPress={handleTelegramPress} activeOpacity={0.7}>
            <Text style={[styles.telegram, { color: colors.primary500 }]}>@{customer.telegramUsername}</Text>
          </TouchableOpacity>
        )}
      </View>

      {courierName && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Курьер:</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{courierName}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
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
  },
  phone: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
  },
  telegram: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
  },
});

export default OrderCardCustomer;
