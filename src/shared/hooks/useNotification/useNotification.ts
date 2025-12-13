import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import {
  displayNotification,
  requestMessagingPermission,
  requestNotificationPermission,
  sendToken,
} from "./utils";
import notifee, { EventType } from "@notifee/react-native";
import * as Updates from "expo-updates";
import { useNavigation } from "@react-navigation/native";
import { AppState } from "react-native";
import { router } from "expo-router";

messaging().setBackgroundMessageHandler(displayNotification);

const NAVIGATION_DELAY = 2000; // Задержка перед навигацией для инициализации приложения

const parseRoute = (
  routeString: string | object | undefined
): { orderId?: string; type?: string } | null => {
  if (!routeString) {
    return null;
  }

  try {
    if (typeof routeString === "object") {
      return routeString as { orderId?: string; type?: string };
    }

    if (typeof routeString === "string") {
      const parsed = JSON.parse(routeString);
      return parsed;
    }

    return null;
  } catch (error) {
    return null;
  }
};

const handleNotificationRoute = (
  routeData: { orderId?: string; type?: string } | null
) => {
  if (!routeData || !routeData.orderId) {
    return;
  }

  const routePath =
    `/(protected)/order-details?orderId=${routeData.orderId}` as any;

  try {
    router.push(routePath);
  } catch (error) {
    // Ошибка навигации игнорируется
  }
};

const handleNotificationEvent = async ({
  type,
  detail,
}: {
  type: EventType;
  detail: any;
}) => {
  const { notification, pressAction, input } = detail;

  switch (type) {
    case EventType.DISMISSED:
      break;
    case EventType.PRESS:
    case EventType.ACTION_PRESS:
      const dataRoute = notification?.data?.route;
      const parsedRoute = parseRoute(dataRoute);

      if (pressAction?.id === "reply") {
        if (notification?.id) {
          await notifee.cancelNotification(notification.id);
        }
        return;
      }

      if (parsedRoute) {
        setTimeout(() => {
          handleNotificationRoute(parsedRoute);
        }, NAVIGATION_DELAY);
      } else {
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

notifee.onBackgroundEvent(async (event) => {
  await handleNotificationEvent(event);
});

notifee.onForegroundEvent(async (event) => {
  await handleNotificationEvent(event);
});

export const useNotification = (isSignedIn: boolean) => {
  const navigation = useNavigation();

  const getCurrentRoute = () => {
    const state = navigation?.getState();
    return state?.routes[state?.index]?.name;
  };

  const initializeNotifications = async () => {
    try {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        const dataRoute = initialNotification?.data?.route;
        const parsedRoute = parseRoute(dataRoute);

        if (parsedRoute) {
          setTimeout(() => {
            handleNotificationRoute(parsedRoute);
          }, NAVIGATION_DELAY);
        }
      }

      let permissionStatus = false;
      try {
        permissionStatus = await requestNotificationPermission();
      } catch (error) {
        // Игнорируем ошибки разрешений
      }

      let hasMessagingPermission = false;
      try {
        hasMessagingPermission = await requestMessagingPermission();
      } catch (error) {
        // Игнорируем ошибки разрешений
      }

      if (hasMessagingPermission) {
        try {
          const token = await messaging().getToken();

          if (token) {
            await sendToken(token);
          }
        } catch (error) {
          // Игнорируем ошибки токена
        }
      }
    } catch (error) {
      // Игнорируем критические ошибки
    }

    const handleNotificationClick = async (response: any) => {
      const notificationData = response?.notification?.request?.content?.data;
      const dataRoute =
        notificationData?.data?.route || notificationData?.route;
      const parsedRoute = parseRoute(dataRoute);

      if (parsedRoute) {
        setTimeout(() => {
          handleNotificationRoute(parsedRoute);
        }, NAVIGATION_DELAY);
      }
    };

    const notificationClickSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationClick
      );

    messaging().onNotificationOpenedApp((remoteMessage: any) => {
      const dataRoute = remoteMessage?.data?.route;
      const parsedRoute = parseRoute(dataRoute);

      if (parsedRoute) {
        setTimeout(() => {
          handleNotificationRoute(parsedRoute);
        }, NAVIGATION_DELAY);
      } else {
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

    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      const currentRoute = getCurrentRoute();
      if (currentRoute !== "Chats" && AppState.currentState === "active") {
        await displayNotification(remoteMessage);
      }
    });

    return () => {
      unsubscribe();
      notificationClickSubscription.remove();
    };
  };

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    let cleanup: (() => void) | undefined;

    initializeNotifications()
      .then((cleanupFn) => {
        cleanup = cleanupFn;
      })
      .catch(() => {
        // Игнорируем ошибки инициализации
      });

    const onTokenRefresh = messaging().onTokenRefresh(async (token) => {
      try {
        if (token) {
          await sendToken(token);
        }
      } catch (error) {
        // Игнорируем ошибки обновления токена
      }
    });

    return () => {
      cleanup?.();
      onTokenRefresh();
    };
  }, [isSignedIn]);
};
