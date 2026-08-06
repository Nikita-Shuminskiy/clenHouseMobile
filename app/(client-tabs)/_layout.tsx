import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useNotification } from "@/src/shared/hooks/useNotification/useNotification";
import { CLIENT_COLORS } from "@/src/screens/client/components/ClientUI";

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home-outline",
  orders: "receipt-outline",
  subscription: "calendar-outline",
  profile: "person-outline",
};

export default function ClientTabsLayout() {
  const insets = useSafeAreaInsets();
  const { data: user } = useGetMe();
  useNotification(!!user?.id);

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={({ state, descriptors, navigation }) => (
          <View style={[styles.barWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <View style={styles.bar}>
              {state.routes.map((route, index) => {
                const focused = state.index === index;
                const title = descriptors[route.key].options.title ?? route.name;
                return (
                  <Pressable
                    key={route.key}
                    onPress={() => navigation.navigate(route.name)}
                    style={[styles.item, focused && styles.itemActive]}
                  >
                    <Ionicons
                      name={iconByRoute[route.name] ?? "ellipse-outline"}
                      size={21}
                      color={focused ? CLIENT_COLORS.primary : CLIENT_COLORS.muted}
                    />
                    <Text style={[styles.label, focused && styles.labelActive]}>
                      {title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      >
        <Tabs.Screen name="index" options={{ title: "Главная" }} />
        <Tabs.Screen name="orders" options={{ title: "Заказы" }} />
        <Tabs.Screen name="subscription" options={{ title: "Подписка" }} />
        <Tabs.Screen name="profile" options={{ title: "Профиль" }} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: "rgba(250,247,243,0.94)",
  },
  bar: {
    minHeight: 64,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: CLIENT_COLORS.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#3A2A1E",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  item: {
    minWidth: 62,
    minHeight: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  itemActive: {
    backgroundColor: "#FFF0E5",
  },
  label: {
    fontFamily: "Onest",
    fontWeight: "700",
    fontSize: 10,
    color: CLIENT_COLORS.muted,
  },
  labelActive: {
    color: CLIENT_COLORS.primary,
  },
});
