import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import {
  displayNotification,
  requestMessagingPermission,
  requestNotificationPermission,
  sendToken,
  extractOrderIdFromNotification,
  buildOrderDetailsRoute,
} from "./utils";
import notifee, { EventType } from "@notifee/react-native";
import * as Updates from "expo-updates";
import { router } from "expo-router";
import { AppState } from "react-native";
import {
  savePendingNavigation,
  savePendingAuthNavigation,
  loadPendingNavigation,
  clearPendingNavigation,
} from "@/src/shared/utils/pendingNavigation";
import { isAppReadyForNavigation } from "@/src/shared/utils/navigationReady";

messaging().setBackgroundMessageHandler(displayNotification);

/**
 * Глобальное состояние готовности приложения к навигации
 * Обновляется из _layout.tsx при изменении состояния готовности и авторизации
 */
let globalIsNavigationReady = false;
let globalIsAuthorized = false;

/**
 * Устанавливает глобальное состояние готовности навигации
 * Вызывается из _layout.tsx для синхронизации состояния между компонентами
 * 
 * @param isReady - Готовность роутера (splash screen скрыт, роутер инициализирован)
 * @param isAuthorized - Статус авторизации пользователя
 */
export const setNavigationReadyState = (
  isReady: boolean,
  isAuthorized: boolean
) => {
  globalIsNavigationReady = isReady;
  globalIsAuthorized = isAuthorized;
};

/**
 * Обрабатывает навигацию по push-уведомлению
 * 
 * Логика работы:
 * 1. Извлекает orderId из данных уведомления (поддерживает новый и legacy форматы)
 * 2. Проверяет готовность приложения (isNavigationReady и isAuthorized)
 * 3. Если не готово - сохраняет pending navigation в AsyncStorage
 * 4. Если готово - выполняет навигацию с отменой предыдущих навигаций
 * 5. Использует router.replace() если уже на экране order-details, иначе router.push()
 * 
 * @param notificationData - Данные из push-уведомления (data объект)
 * @param navigationTimeoutRef - Ref для хранения timeout ID (для отмены предыдущих навигаций)
 */
const handleNotificationNavigation = async (
  notificationData: any,
  navigationTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
) => {
  try {
    // Извлекаем orderId из данных уведомления
    const orderId = extractOrderIdFromNotification(notificationData);

    if (!orderId) {
      console.warn(
        "[handleNotificationNavigation] No orderId found in notification data, navigating to home"
      );
      // Если orderId отсутствует, перенаправляем на главный экран без ошибок
      if (isAppReadyForNavigation(globalIsNavigationReady, globalIsAuthorized)) {
        router.replace("/(protected-tabs)");
      } else {
        // Если приложение не готово, не сохраняем pending navigation для отсутствующего orderId
        console.log(
          "[handleNotificationNavigation] App not ready, but no orderId to save"
        );
      }
      return;
    }

    // Проверяем готовность приложения
    const isReady = isAppReadyForNavigation(
      globalIsNavigationReady,
      globalIsAuthorized
    );

    if (!isReady) {
      console.log(
        "[handleNotificationNavigation] App not ready, saving pending navigation"
      );
      // Сохраняем pending navigation для выполнения после готовности
      if (!globalIsAuthorized) {
        await savePendingAuthNavigation(orderId);
      } else {
        await savePendingNavigation(orderId);
      }
      return;
    }

    // Отменяем предыдущую навигацию если она еще выполняется
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }

    // Строим маршрут
    const route = buildOrderDetailsRoute(orderId);

    // Проверяем, находимся ли мы уже на экране деталей заказа
    const currentPath = router.canGoBack() ? "unknown" : "initial";
    const isOnOrderDetails = currentPath.includes("order-details");

    // Выполняем навигацию с небольшой задержкой для стабильности
    navigationTimeoutRef.current = setTimeout(() => {
      try {
        if (isOnOrderDetails) {
          // Если уже на экране деталей заказа, заменяем его
          router.replace(route as any);
        } else {
          // Иначе добавляем в стек
          router.push(route as any);
        }
        console.log(
          `[handleNotificationNavigation] Navigation executed: ${route}`
        );
      } catch (error) {
        console.error("[Navigation Error] Failed to execute navigation:", error);
        // Логируем детали для диагностики
        console.error("[Navigation Error] Route:", route);
        console.error("[Navigation Error] Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      } finally {
        navigationTimeoutRef.current = null;
      }
    }, 100);
  } catch (error) {
    console.error(
      "[Navigation Error] Error processing notification:",
      error
    );
    // Логируем ошибку для диагностики, но не показываем технические детали пользователю
    console.error(
      "[Navigation Error] Notification data:",
      JSON.stringify(notificationData, null, 2)
    );
    // В случае ошибки перенаправляем на главный экран без белого экрана
    if (isAppReadyForNavigation(globalIsNavigationReady, globalIsAuthorized)) {
      try {
        router.replace("/(protected-tabs)");
      } catch (navError) {
        console.error(
          "[Navigation Error] Error navigating to home:",
          navError
        );
      }
    }
  }
};

// Ref для хранения timeout ID текущей навигации (для отмены предыдущих)
const navigationTimeoutRef: { current: ReturnType<typeof setTimeout> | null } = { current: null };

const handleNotificationEvent = async ({ type, detail }: any) => {
  const { notification, pressAction, input } = detail;

  switch (type) {
    case EventType.DISMISSED:
      break;
    case EventType.PRESS:
    case EventType.ACTION_PRESS:
      if (pressAction?.id === "reply") {
        if (notification?.id) {
          await notifee.cancelNotification(notification.id);
        }
        return;
      }

      // Обрабатываем навигацию через новую функцию
      const notificationData = notification?.data;
      if (notificationData) {
        await handleNotificationNavigation(notificationData, navigationTimeoutRef);
      } else {
        // Если нет данных, перезагружаем приложение
        await Updates.reloadAsync();
      }

      if (notification?.id) {
        await notifee.cancelNotification(notification.id);
      }
      break;
    default:
      break;
  }
};

notifee.onBackgroundEvent(handleNotificationEvent);
notifee.onForegroundEvent(handleNotificationEvent);

export const useNotification = (isSignedIn: boolean) => {
  const localNavigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.log("useNotification: useEffect triggered", { isSignedIn });

    // Обновляем глобальное состояние авторизации
    globalIsAuthorized = isSignedIn;

    if (!isSignedIn) {
      console.log(
        "useNotification: user is not signed in, skipping notification initialization"
      );
      return;
    }

    console.log(
      "useNotification: user is signed in, initializing notifications"
    );

    let notificationClickSubscription: any;
    let unsubscribe: (() => void) | undefined;

    const initializeNotifications = async () => {
      try {
        console.log(
          "useNotification: initializeNotifications started",
          isSignedIn
        );

        // Проверяем и выполняем pending navigation при инициализации
        const pendingNav = await loadPendingNavigation();
        if (pendingNav) {
          console.log(
            `[useNotification] Found pending navigation: orderId=${pendingNav.orderId}`
          );
          // Выполняем pending navigation после небольшой задержки
          setTimeout(async () => {
            if (isAppReadyForNavigation(globalIsNavigationReady, globalIsAuthorized)) {
              const route = buildOrderDetailsRoute(pendingNav.orderId);
              try {
                router.push(route as any);
                await clearPendingNavigation();
                console.log(
                  `[useNotification] Executed pending navigation: ${route}`
                );
              } catch (error) {
                console.error(
                  "[useNotification] Error executing pending navigation:",
                  error
                );
              }
            } else {
              // Если все еще не готово, оставляем pending navigation
              console.log(
                "[useNotification] App still not ready, keeping pending navigation"
              );
            }
          }, 500);
        }

        // Обрабатываем initial notification (когда приложение открыто из закрытого состояния)
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          const notificationData = initialNotification.data;
          if (notificationData) {
            // Небольшая задержка для обеспечения готовности приложения
            setTimeout(() => {
              handleNotificationNavigation(
                notificationData,
                localNavigationTimeoutRef
              );
            }, 1000);
          }
        }

        console.log("useNotification: requesting notification permission");
        const notificationPermission = await requestNotificationPermission();
        console.log(
          "useNotification: notification permission granted",
          notificationPermission
        );

        console.log("useNotification: requesting messaging permission");
        const hasMessagingPermission = await requestMessagingPermission();
        console.log(
          "useNotification: messaging permission granted",
          hasMessagingPermission
        );

        if (hasMessagingPermission) {
          console.log("useNotification: getting FCM token");
          let token = await messaging().getToken();
          console.log("useNotification: FCM token received", token);

          if (!token) {
            console.log(
              "useNotification: token not received, retrying after delay"
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            token = await messaging().getToken();
            console.log("useNotification: FCM token after retry", token);
          }

          if (token) {
            console.log("useNotification: sending token to server");
            await sendToken(token);
            console.log("useNotification: token sent successfully");
          } else {
            console.error("useNotification: FCM token is empty after retry");
          }
        } else {
          console.log(
            "useNotification: messaging permission denied, skipping token registration"
          );
        }
      } catch (error) {
        console.error(
          "useNotification: error in initializeNotifications",
          error
        );
      }

      const handleNotificationClick = async (response: any) => {
        const notificationData =
          response?.notification?.request?.content?.data?.data ||
          response?.notification?.request?.content?.data;
        if (notificationData) {
          await handleNotificationNavigation(
            notificationData,
            localNavigationTimeoutRef
          );
        }
      };

      notificationClickSubscription =
        Notifications.addNotificationResponseReceivedListener(
          handleNotificationClick
        );

      // Обработчик когда приложение открыто из фонового режима
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        const notificationData = remoteMessage?.data;
        if (notificationData) {
          await handleNotificationNavigation(
            notificationData,
            localNavigationTimeoutRef
          );
        } else {
          // Fallback на старый формат
          handleNotificationClick({
            notification: {
              request: {
                content: {
                  data: remoteMessage.data,
                },
              },
            },
          });
        }
      });

      // Обработчик для foreground уведомлений (когда приложение активно)
      unsubscribe = messaging().onMessage(async (remoteMessage) => {
        if (AppState.currentState === "active") {
          // Отображаем уведомление
          await displayNotification(remoteMessage);
          // Навигация будет выполнена при нажатии на уведомление через handleNotificationEvent
          // который обрабатывает EventType.PRESS
        }
      });
    };

    initializeNotifications();

    return () => {
      // Очищаем timeout при размонтировании
      if (localNavigationTimeoutRef.current) {
        clearTimeout(localNavigationTimeoutRef.current);
        localNavigationTimeoutRef.current = null;
      }
      if (unsubscribe) {
        unsubscribe();
      }
      if (notificationClickSubscription) {
        notificationClickSubscription.remove();
      }
    };
  }, [isSignedIn]);
};
