import { Stack } from "expo-router";
import "react-native-reanimated";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="registration-city" />
      <Stack.Screen name="registration-role" />
      <Stack.Screen name="registration-profile" />
      <Stack.Screen name="(forgot-password)" />
      <Stack.Screen name="(reset-password)" />
    </Stack>
  );
}
