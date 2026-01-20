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
import { useEffect, useState } from "react";
import { getStorageIsFirstEnter } from "@/src/shared/utils/isFirstEnter";
import * as SplashScreen from "expo-splash-screen";
import { requestLocationPermission } from "@/src/shared/utils/location-permission";
import { requestNotificationPermission } from "@/src/shared/hooks/useNotification/utils";
import {
  loadPendingAuthNavigation,
  clearPendingAuthNavigation,
} from "@/src/shared/utils/pendingNavigation";
import { buildOrderDetailsRoute } from "@/src/shared/hooks/useNotification/utils";
import { setNavigationReadyState } from "@/src/shared/hooks/useNotification/useNotification";

// Импортируем background handler для регистрации headless tasks
import "@/src/shared/hooks/useNotification/backgroundHandler";
// Импортируем useNotification для регистрации handlers на уровне модуля
import "@/src/shared/hooks/useNotification/useNotification";
import useUpdate from "@/src/shared/hooks/useUpdate";


// Сохраняем splash screen видимым до готовности приложения
SplashScreen.preventAutoHideAsync();

const RootStack = () => {
  const { data: userMe, isLoading: isLoadingGetMe } = useGetMe();
  console.log(userMe, "userMe");

  const { data: isFirstEnter, isLoading: isLoadingGetIsFirstEnter } = useQuery({
    queryKey: ["isFirstEnter"],
    queryFn: () => getStorageIsFirstEnter(),
  });
  const { isUpdate, onCloseUpdateModal } = useUpdate();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  // Скрываем splash screen после небольшой задержки, чтобы он успел показаться
  useEffect(() => {
    const prepareApp = async () => {
      // Ждем минимум 500мс чтобы splash screen успел показаться
      await new Promise(resolve => setTimeout(resolve, 500));

      // Запрашиваем разрешение на геолокацию в начале приложения
      // Используется для поиска ближайших заказов курьеру
      await requestLocationPermission();

      // Скрываем splash screen
      await SplashScreen.hideAsync();
      setIsNavigationReady(true);
      requestNotificationPermission();
    };

    prepareApp();
  }, []);


  useEffect(() => {
    // Обновляем глобальное состояние готовности навигации
    const isAuthorized = !!userMe?.role;
    setNavigationReadyState(isNavigationReady, isAuthorized);

    if (isLoadingGetMe || isLoadingGetIsFirstEnter || !isNavigationReady) {
      return;
    }

    // Проверяем, находимся ли мы уже на нужном экране, чтобы избежать лишних переходов
    const currentPath = router.canGoBack() ? 'unknown' : 'initial';

    if (userMe?.role) {
      // Проверяем наличие pending navigation после успешной авторизации
      loadPendingAuthNavigation().then((pendingNav) => {
        if (pendingNav) {
          console.log(
            `[_layout] Found pending auth navigation: orderId=${pendingNav.orderId}`
          );
          // Выполняем навигацию после небольшой задержки
          setTimeout(async () => {
            try {
              const route = buildOrderDetailsRoute(pendingNav.orderId);
              router.push(route as any);
              await clearPendingAuthNavigation();
              console.log(`[_layout] Executed pending auth navigation: ${route}`);
            } catch (error) {
              console.error(
                "[_layout] Error executing pending auth navigation:",
                error
              );
              // В случае ошибки перенаправляем на главный экран
              if (!currentPath.includes('protected')) {
                router.replace("/(protected-tabs)");
              }
            }
          }, 300);
        } else {
          // Если нет pending navigation, выполняем обычную логику
          if (!currentPath.includes('protected')) {
            router.replace("/(protected-tabs)");
          }
        }
      });
    } else if (isFirstEnter === "true") {
      router.replace("/(auth)/onboarding");
    } else {
      router.replace("/(auth)");
    }
  }, [userMe, isLoadingGetMe, isFirstEnter, isLoadingGetIsFirstEnter, isNavigationReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected-tabs)" />
      <Stack.Screen name="(protected)" />
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
