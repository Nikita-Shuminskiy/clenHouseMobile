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

messaging().setBackgroundMessageHandler(displayNotification);

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
      // await notifee.stopForegroundService()
      break;
    case EventType.PRESS:
    case EventType.ACTION_PRESS:
      const dataRoute = notification?.data?.route;

      if (pressAction?.id === "reply") {
        //send message to chat

        if (notification?.id) {
          await notifee.cancelNotification(notification.id);
        }
        return;
      }

      if (dataRoute) {
        //  handleNotificationRoute(dataRoute);
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
  const navigation = useNavigation();

  const getCurrentRoute = () => {
    const state = navigation?.getState();
    return state?.routes[state?.index]?.name;
  };

  const initializeNotifications = async () => {
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      const dataRoute = initialNotification?.data?.route;

      setTimeout(() => {
        if (dataRoute) {
          //  handleNotificationRoute(dataRoute);
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
      const dataRoute = notificationData?.data?.route;
      if (dataRoute) {
        //  handleNotificationRoute(dataRoute);
      } else {
      }
    };

    const notificationClickSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationClick
      );

    messaging().onNotificationOpenedApp((remoteMessage) => {
      const dataRoute = remoteMessage?.data?.route;
      if (dataRoute) {
        //  handleNotificationRoute(dataRoute);
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
    if (isSignedIn) {
      initializeNotifications();
    }
  }, [isSignedIn]);
};
