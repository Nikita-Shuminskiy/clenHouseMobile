import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="confirm-code" />
      <Stack.Screen name="registration-role" />
      <Stack.Screen name="registration-profile" />
      <Stack.Screen name="(forgot-password)" />
      <Stack.Screen name="(reset-password)" />
    </Stack>
  );
}
