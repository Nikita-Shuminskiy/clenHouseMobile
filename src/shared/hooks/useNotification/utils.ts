import messaging, { getToken } from "@react-native-firebase/messaging";
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";
import * as Notifications from "expo-notifications";

import { PermissionsAndroid, Platform } from "react-native";
import { api } from "../../api/utils/axios-api-base";
import { AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { instance } from "../../api/configs/config";

export const addDeviceToken = async (
  token: string
): Promise<AxiosResponse<void>> => {
  console.log(token, "tokens111");

  const response = await instance.patch<any>("/user/add-device-token", {
    token: token,
  });
  return response;
};

export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      } catch (error) {
        // Игнорируем ошибки
      }
    }

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      } catch (error) {
        // Игнорируем ошибки
      }
    }

    if (finalStatus === "granted") {
      try {
        const notifeeSettings = await notifee.getNotificationSettings();

        if (notifeeSettings.authorizationStatus < 1) {
          try {
            await Promise.race([
              notifee.requestPermission({
                sound: true,
                announcement: true,
                alert: true,
                criticalAlert: true,
              }),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error("Notifee request timeout")),
                  5000
                )
              ),
            ]);
          } catch (error) {
            // Игнорируем ошибки Notifee
          }
        }
      } catch (error) {
        // Игнорируем ошибки проверки Notifee
      }
    }

    return finalStatus === "granted";
  } catch (error) {
    return false;
  }
};

export const sendToken = async (token: string) => {
  try {
    if (!token) {
      return;
    }
    await addDeviceToken(token);
  } catch (error) {
    throw error;
  }
};

export const requestMessagingPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    return false;
  }
};

export const displayNotification = async (remoteMessage: any) => {
  // Получаем данные из notification или data
  const title =
    remoteMessage?.notification?.title ||
    remoteMessage?.data?.title ||
    "Default title";
  const body =
    remoteMessage?.notification?.body ||
    remoteMessage?.data?.body ||
    "Default body";
  const route = remoteMessage?.data?.route;

  const channelId = await createChannel();

  if (Platform.OS === "ios" && route === "Chats") {
    await createCategoriesChatIos();
  }

  const isChatNotification = route === "Chats";
  const chatId = remoteMessage?.data?.chatId;
  const groupKey = isChatNotification && chatId ? `Chats` : "";

  const notificationData = {
    route: route || "1",
    ...remoteMessage?.data,
  };

  await notifee.displayNotification({
    title,
    body,
    data: notificationData,
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
      lightUpScreen: true,
      largeIcon: "notification_icon",
      color: "gray",
      groupId: groupKey,
      showTimestamp: true,
      sortKey: "1",
    },
    ios: {
      foregroundPresentationOptions: {
        sound: true,
        alert: true,
        banner: true,
      },
      launchImageName: "notification_icon",
      critical: true,
      categoryId: groupKey ? "chat" : "default",
      summaryArgument: "John",
      summaryArgumentCount: 10,
    },
  });
};

const createChannel = async () => {
  return await notifee.createChannel({
    id: "default",
    name: "default",
    vibration: true,
    visibility: AndroidVisibility.PUBLIC,
    sound: "default",
    lights: true,
    badge: true,
    importance: AndroidImportance.HIGH,
  });
};

const createCategoriesChatIos = async () => {
  await notifee.setNotificationCategories([
    {
      id: "Chats",
      summaryFormat: "You have %u+ unread messages from %@.",
      actions: [
        {
          id: "reply",
          title: "Reply",
          input: {
            placeholderText: "Send a message...",
            buttonText: "Send Now",
          },
        },
      ],
    },
  ]);
};
