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
  useEffect(() => {
    console.log("useNotification: useEffect triggered", { isSignedIn });

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

        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification) {
          const dataRoute = initialNotification?.data?.route;

          setTimeout(() => {
            if (dataRoute) {
              handleNotificationRoute(dataRoute);
            }
          }, 1000);
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
        const notificationData = response?.notification?.request?.content?.data;
        const dataRoute =
          notificationData?.data?.route || notificationData?.route;
        if (dataRoute) {
          handleNotificationRoute(dataRoute);
        }
      };

      notificationClickSubscription =
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

      unsubscribe = messaging().onMessage(async (remoteMessage) => {
        if (AppState.currentState === "active") {
          await displayNotification(remoteMessage);
        }
      });
    };

    initializeNotifications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (notificationClickSubscription) {
        notificationClickSubscription.remove();
      }
    };
  }, [isSignedIn]);
};
