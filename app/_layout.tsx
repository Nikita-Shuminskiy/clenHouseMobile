import { ErrorBoundary } from "@components/ui-kit/error-boundary";
import { router, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { queryClient } from "@/src/shared/api/configs/query-client-config";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster, toast } from "sonner-native";
import { ThemeProvider } from "../src/shared/use-theme";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getStorageIsFirstEnter } from "@/src/shared/utils/isFirstEnter";
import * as SplashScreen from "expo-splash-screen";
import { requestNotificationPermission , buildOrderDetailsRoute } from "@/src/shared/hooks/useNotification/utils";
import {
  loadPendingAuthNavigation,
  clearPendingAuthNavigation,
} from "@/src/shared/utils/pendingNavigation";
import { setNavigationReadyState } from "@/src/shared/hooks/useNotification/useNotification";
import { isValidUUID } from "@/src/shared/utils/uuidValidation";
import { UserRole } from "@/src/shared/api/types/data-contracts";
import { removeToken, removeRefreshToken } from "@/src/shared/utils/token";
import {
  getHomeRouteForUser,
  getPrimaryRoleForUser,
  isCourierUser,
  isCustomerUser,
} from "@/src/shared/utils/role-routing";

// Импортируем background handler для регистрации headless tasks
import "@/src/shared/hooks/useNotification/backgroundHandler";
import useUpdate from "@/src/shared/hooks/useUpdate";
import UpdateAvailableModal from "@/src/shared/components/modals/UpdateAvailableModal";
import { HARVEST_COLORS } from "@/src/shared/harvest-theme";


// Сохраняем splash screen видимым до готовности приложения
SplashScreen.preventAutoHideAsync();

const RootStack = () => {
  const {
    data: userMe,
    isLoading: isLoadingGetMe,
    isFetching: isFetchingGetMe,
    hasToken,
    isTokenChecked,
  } = useGetMe();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const { data: isFirstEnter, isLoading: isLoadingGetIsFirstEnter } = useQuery({
    queryKey: ["isFirstEnter"],
    queryFn: () => getStorageIsFirstEnter(),
  });
  const { isUpdateAvailable, isDownloading, onCloseUpdateModal, onApplyUpdate } = useUpdate();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const isAuthBootstrapLoading =
    !isTokenChecked ||
    (hasToken && (isLoadingGetMe || isFetchingGetMe));
  // Скрываем splash screen после небольшой задержки, чтобы он успел показаться
  useEffect(() => {
    const prepareApp = async () => {
      // Ждем минимум 500мс чтобы splash screen успел показаться
      await new Promise(resolve => setTimeout(resolve, 500));

      // Скрываем splash screen
      await SplashScreen.hideAsync();
      setIsNavigationReady(true);
      requestNotificationPermission();
    };

    prepareApp();
  }, []);


  useEffect(() => {
    // Обновляем глобальное состояние готовности навигации
    const primaryRole = getPrimaryRoleForUser(userMe);
    setNavigationReadyState(isNavigationReady, !!primaryRole, primaryRole);

    if (isAuthBootstrapLoading || isLoadingGetIsFirstEnter || !isNavigationReady) {
      return;
    }

    if (hasToken && pathname.startsWith("/payment/result")) {
      return;
    }

    if (pathname.startsWith("/telegram-auth")) {
      return;
    }

    // Проверяем, находимся ли мы уже на нужном экране, чтобы избежать лишних переходов
    const currentPath = router.canGoBack() ? 'unknown' : 'initial';

    if (isCourierUser(userMe)) {
      // Проверяем наличие pending navigation после успешной авторизации
      loadPendingAuthNavigation().then((pendingNav) => {
        if (pendingNav) {
          // Валидируем UUID перед выполнением pending auth navigation
          if (!isValidUUID(pendingNav.orderId)) {
            console.warn(
              `[_layout] Invalid orderId in pending auth navigation: ${pendingNav.orderId}, clearing`
            );
            clearPendingAuthNavigation();
            if (!currentPath.includes('protected')) {
              router.replace("/(protected-tabs)");
            }
            return;
          }
          
          // Выполняем навигацию после небольшой задержки
          setTimeout(async () => {
            let route: ReturnType<typeof buildOrderDetailsRoute> | null = null;
            try {
              route = buildOrderDetailsRoute(pendingNav.orderId, UserRole.CURRIER);
              router.push(route as any);
              await clearPendingAuthNavigation();
            } catch (error) {
              const fullPath = route 
                ? (typeof route === 'string' 
                    ? route 
                    : `${route.pathname}?${Object.entries(route.params || {}).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')}`)
                : `orderId=${pendingNav.orderId}`;
              
              console.error("[_layout] ❌ Error executing pending auth navigation");
              console.error("[_layout] Attempted route:", fullPath);
              if (route) {
                console.error("[_layout] Route object:", JSON.stringify(route, null, 2));
              }
              console.error("[_layout] Error details:", {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
              });
              
              // Очищаем pending navigation при ошибке
              await clearPendingAuthNavigation();
              
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
    } else if (isCustomerUser(userMe)) {
      loadPendingAuthNavigation().then((pendingNav) => {
        if (pendingNav && isValidUUID(pendingNav.orderId)) {
          setTimeout(async () => {
            try {
              router.push(buildOrderDetailsRoute(pendingNav.orderId, UserRole.CUSTOMER) as any);
              await clearPendingAuthNavigation();
            } catch (error) {
              console.error("[_layout] Error executing customer pending navigation", error);
              await clearPendingAuthNavigation();
              router.replace("/(client-tabs)" as any);
            }
          }, 300);
          return;
        }

        if (pendingNav) {
          clearPendingAuthNavigation();
        }
        router.replace(getHomeRouteForUser(userMe));
      });
    } else if (Array.isArray(userMe?.roles) && userMe.roles.length > 0) {
      toast.error('Доступ запрещен', {
        description: 'Для этой роли нет мобильного интерфейса',
        duration: 5000,
      });
      removeToken();
      removeRefreshToken();
      queryClient.setQueryData(['me'], null);
      router.replace("/(auth)");
    } else if (!hasToken && isFirstEnter === "true") {
      router.replace("/(auth)/onboarding");
    } else {
      router.replace("/(auth)");
    }
  }, [
    userMe,
    hasToken,
    isAuthBootstrapLoading,
    isFirstEnter,
    isLoadingGetIsFirstEnter,
    isNavigationReady,
    pathname,
  ]);

  if (isAuthBootstrapLoading || isLoadingGetIsFirstEnter || !isNavigationReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: HARVEST_COLORS.canvas,
        }}
      >
        <ActivityIndicator size="large" color={HARVEST_COLORS.flame} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(client-tabs)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="payment/result" />
        <Stack.Screen name="telegram-auth" />
        <Stack.Screen name="(protected-tabs)" />
        <Stack.Screen name="(protected)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <UpdateAvailableModal
        visible={isUpdateAvailable}
        isDownloading={isDownloading}
        onClose={onCloseUpdateModal}
        onApply={onApplyUpdate}
      />
    </>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: HARVEST_COLORS.canvas }}>
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
                  color: HARVEST_COLORS.ink,
                  fontSize: 16,
                  lineHeight: 20,
                },
                descriptionStyle: {
                  fontSize: 12,
                  lineHeight: 14,
                  color: HARVEST_COLORS.stone,
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
            <StatusBar style="dark" backgroundColor={HARVEST_COLORS.canvas} />
          </ErrorBoundary>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
