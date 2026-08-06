import { Stack } from "expo-router";

export default function ClientStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-order" />
      <Stack.Screen name="order-details" />
      <Stack.Screen name="payment" />
    </Stack>
  );
}
