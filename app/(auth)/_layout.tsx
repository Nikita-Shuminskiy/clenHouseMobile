import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="confirm-code" />
        <Stack.Screen name="registration-role" />
        <Stack.Screen name="registration-profile" />
        <Stack.Screen name="(forgot-password)" />
        <Stack.Screen name="(reset-password)" />
      </Stack>
    </SafeAreaView>
  );
}
