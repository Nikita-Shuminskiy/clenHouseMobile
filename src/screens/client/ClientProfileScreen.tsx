import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { queryClient } from "@/src/shared/api/configs/query-client-config";
import { setManualLogoutInProgress } from "@/src/shared/api/configs/config";
import { removeRefreshToken, removeToken } from "@/src/shared/utils/token";
import {
  Card,
  CLIENT_COLORS,
  ClientScreen,
  PrimaryButton,
  SectionTitle,
} from "./components/ClientUI";

const ClientProfileScreen = () => {
  const { data: user } = useGetMe();

  const logout = async () => {
    setManualLogoutInProgress(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await removeToken();
    await removeRefreshToken();
    router.replace("/(auth)");
  };

  return (
    <ClientScreen title="Профиль" subtitle="Аккаунт и поддержка">
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0] ?? "К"}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? "Клиент"}</Text>
          <Text style={styles.text}>{user?.phone || "Телефон не указан"}</Text>
          <Text style={styles.text}>{user?.email || "Email не указан"}</Text>
        </Card>

        <Card style={styles.card}>
          <SectionTitle>Настройки</SectionTitle>
          <PrimaryButton
            variant="secondary"
            onPress={() => router.push("/(protected)/support")}
          >
            Поддержка
          </PrimaryButton>
          <PrimaryButton
            variant="secondary"
            onPress={() => router.push("/(protected)/privacy")}
          >
            Политика конфиденциальности
          </PrimaryButton>
          <PrimaryButton variant="danger" onPress={logout}>
            Выйти
          </PrimaryButton>
        </Card>
      </ScrollView>
    </ClientScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 110,
    gap: 12,
  },
  card: {
    gap: 12,
    alignItems: "stretch",
  },
  avatar: {
    alignSelf: "center",
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFF0E5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Onest",
    fontWeight: "900",
    fontSize: 34,
    color: CLIENT_COLORS.primaryDark,
  },
  name: {
    fontFamily: "Onest",
    fontWeight: "800",
    fontSize: 21,
    textAlign: "center",
    color: CLIENT_COLORS.ink,
  },
  text: {
    fontFamily: "Onest",
    fontSize: 15,
    textAlign: "center",
    color: CLIENT_COLORS.muted,
  },
});

export default ClientProfileScreen;
