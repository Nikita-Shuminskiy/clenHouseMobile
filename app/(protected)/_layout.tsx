import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="order-details" />
      <Stack.Screen name="support" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}
