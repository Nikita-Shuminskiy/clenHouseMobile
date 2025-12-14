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
import { router } from "expo-router";
import { AppState } from "react-native";

messaging().setBackgroundMessageHandler(displayNotification);

const handleNotificationRoute = (route: string | object | undefined) => {
  if (!route) {
    return;
  }

  let routePath: string;

  if (typeof route === "string") {
    try {
      const parsed = JSON.parse(route);
      routePath =
        typeof parsed === "string"
          ? parsed
          : parsed.path || parsed.route || route;
    } catch {
      routePath = route;
    }
  } else if (typeof route === "object" && route !== null) {
    routePath = (route as any).path || (route as any).route || String(route);
  } else {
    return;
  }

  setTimeout(() => {
    try {
      router.push(routePath as any);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  }, 1000);
};

const handleNotificationEvent = async ({ type, detail }: any) => {
  const { notification, pressAction, input } = detail;

  switch (type) {
    case EventType.DISMISSED:
      break;
    case EventType.PRESS:
    case EventType.ACTION_PRESS:
      const dataRoute = notification?.data?.route;

      if (pressAction?.id === "reply") {
        if (notification?.id) {
          await notifee.cancelNotification(notification.id);
        }
        return;
      }

      if (dataRoute) {
        handleNotificationRoute(dataRoute);
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

notifee.onBackgroundEvent(handleNotificationEvent);
notifee.onForegroundEvent(handleNotificationEvent);

export const useNotification = (isSignedIn: boolean) => {
  const initializeNotifications = async () => {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      const dataRoute = initialNotification?.data?.route;

      setTimeout(() => {
        if (dataRoute) {
          handleNotificationRoute(dataRoute);
        }
      }, 1000);
    }

    await requestNotificationPermission();

    const hasMessagingPermission = await requestMessagingPermission();
    if (hasMessagingPermission) {
      const token = await messaging().getToken();
      await sendToken(token);
    }

    const handleNotificationClick = async (response: any) => {
      const notificationData = response?.notification?.request?.content?.data;
      const dataRoute =
        notificationData?.data?.route || notificationData?.route;
      if (dataRoute) {
        handleNotificationRoute(dataRoute);
      }
    };

    const notificationClickSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationClick
      );

    messaging().onNotificationOpenedApp((remoteMessage) => {
      const dataRoute = remoteMessage?.data?.route;
      if (dataRoute) {
        handleNotificationRoute(dataRoute);
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

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (AppState.currentState === "active") {
        await displayNotification(remoteMessage);
      }
    });

    return () => {
      unsubscribe();
      notificationClickSubscription.remove();
    };
  };

  useEffect(() => {
    if (isSignedIn) {
      initializeNotifications();
    }
  }, [isSignedIn]);
};
