import { ErrorBoundary } from "@components/ui-kit/error-boundary";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { queryClient } from "@/src/shared/api/configs/query-client-config";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { ThemeProvider } from "../src/shared/use-theme";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useEffect } from "react";
import { getStorageIsFirstEnter } from "@/src/shared/utils/isFirstEnter";

const RootStack = () => {
  // const {
  //   isAuthenticated,
  //   isLoading,
  //   isCheckingAuth,
  //   isFirstEnter,
  //   isInitialized,
  //   setIsInitialized,
  //   setAuth,
  //   setCheckingAuth,
  //   user
  // } = useAuthStore();

  const { data: userMe, isLoading: isLoadingGetMe } = useGetMe();
  const { data: isFirstEnter, isLoading: isLoadingGetIsFirstEnter } = useQuery({
    queryKey: ["isFirstEnter"],
    queryFn: () => getStorageIsFirstEnter(),
  });

  useEffect(() => {
    if (isLoadingGetMe || isLoadingGetIsFirstEnter) {
      return;
    }

    if (userMe?.role) {
      router.replace("/(protected-tabs)");
    } else if (isFirstEnter === "true") {
      router.replace("/(auth)/onboarding");
    } else {
      router.replace("/(auth)");
    }
  }, [userMe, isLoadingGetMe, isFirstEnter, isLoadingGetIsFirstEnter]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected-tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ErrorBoundary>
            <Toaster
              // icons={{
              //   success: <Image width={24} height={24} source={imgSuccess} />,
              //   warning: <Image width={24} height={24} source={imgWarning} />,
              //   error: <Image width={24} height={24} source={imgWarning} />,
              // }}
              toastOptions={{
                style: {
                  zIndex: 9999,
                },
                toastContainerStyle: {
                  zIndex: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                },
                toastContentStyle: {
                  zIndex: 9999,
                  minWidth: 320,
                  alignItems: "center",
                  justifyContent: "center",
                },
                titleStyle: {
                  color: "#363636",
                  fontSize: 16,
                  lineHeight: 20,
                },
                descriptionStyle: {
                  fontSize: 12,
                  lineHeight: 14,
                  color: "#8E8E8E",
                },
              }}
              style={{
                // zIndex: 9999,
                borderRadius: 22,
                width: "100%",
                paddingVertical: 16,
                // paddingHorizontal: 41,
              }}
              closeButton
              offset={60}
              position="top-center"
            />
            <RootStack />
            <StatusBar style="auto" />
          </ErrorBoundary>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
