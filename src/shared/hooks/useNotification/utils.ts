import messaging from "@react-native-firebase/messaging";
import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";
import * as Notifications from "expo-notifications";

import { PermissionsAndroid, Platform } from "react-native";
import { api } from "../../api/utils/axios-api-base";
import { AxiosResponse } from "axios";

export const addDeviceToken = async (
  token: string
): Promise<AxiosResponse<void>> => {
  const response = await api.patch<any>({
    url: `user/add-device-token`,
    body: {
      token: token,
    },
  });
  console.log("Токен успешно отправлен на сервер:", response.status);
  return response;
};

export const requestNotificationPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  await notifee.requestPermission({
    sound: true,
    announcement: true,
    alert: true,
    criticalAlert: true,
  });
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
};

export const sendToken = async (token: string) => {
  try {
    if (!token) {
      console.warn("Попытка отправить пустой токен");
      return;
    }
    await addDeviceToken(token);
  } catch (error) {
    console.error("Ошибка отправки токена на сервер:", error);
    throw error;
  }
};

export const requestMessagingPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

export const displayNotification = async (remoteMessage: any) => {
  const channelId = await createChannel();

  if (Platform.OS === "ios" && remoteMessage?.data?.route === "Chats") {
    await createCategoriesChatIos();
  }

  const isChatNotification = remoteMessage?.data?.route === "Chats";
  const chatId = remoteMessage?.data?.chatId;
  const groupKey = isChatNotification && chatId ? `Chats` : "";

  await notifee.displayNotification({
    title:
      remoteMessage?.data?.title || remoteMessage?.title || "Default title",
    body: remoteMessage?.data?.body || remoteMessage?.body || "Default body",
    data: {
      route: remoteMessage?.data?.route || "1",
      ...remoteMessage?.data,
    },
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
      lightUpScreen: true,
      largeIcon: "notification_icon",
      color: "green",
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
