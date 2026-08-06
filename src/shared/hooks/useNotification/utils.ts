import messaging from "@react-native-firebase/messaging";
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
import { isValidUUID } from "@/src/shared/utils/uuidValidation";
import { UserRole } from "@/src/shared/api/types/data-contracts";

export const addDeviceToken = async (
  token: string
): Promise<AxiosResponse<void>> => {
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
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }

    if (Platform.OS === "ios") {
      try {
        const notifeeSettings = (await Promise.race([
          notifee.getNotificationSettings(),
          new Promise((resolve) =>
            setTimeout(() => resolve({ authorizationStatus: 0 }), 2000)
          ),
        ])) as any;

        if (notifeeSettings?.authorizationStatus !== 1) {
          const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => {
              resolve({ authorizationStatus: 0 });
            }, 3000)
          );

          const permissionPromise = notifee.requestPermission({
            sound: true,
            announcement: true,
            alert: true,
            criticalAlert: true,
          });

          await Promise.race([permissionPromise, timeoutPromise]);
        }
      } catch (notifeeError) {
        console.error(
          "requestNotificationPermission: notifee error",
          notifeeError
        );
      }
    }

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    const isGranted = finalStatus === "granted";
    return isGranted;
  } catch (error) {
    console.error("requestNotificationPermission: error", error);
    return false;
  }
};

export const sendToken = async (token: string) => {
  if (!token) {
    console.error("sendToken: token is empty");
    return;
  }

  console.log("sendToken: sending token to server", token);
  try {
    await addDeviceToken(token);
  } catch (error) {
    console.error("sendToken: error sending token", error);
    throw error;
  }
};

export const requestMessagingPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const isAuthorized =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    return isAuthorized;
  } catch (error) {
    console.error("requestMessagingPermission: error", error);
    return false;
  }
};

export const getPushNotificationStatus = async (): Promise<boolean> => {
  try {
    const permissions = await Notifications.getPermissionsAsync();
    return permissions.status === "granted";
  } catch (error) {
    console.error("getPushNotificationStatus: error", error);
    return false;
  }
};

export const ensurePushTokenRegistered = async (): Promise<boolean> => {
  try {
    const hasNotificationPermission = await requestNotificationPermission();
    if (!hasNotificationPermission) {
      return false;
    }

    const hasMessagingPermission = await requestMessagingPermission();
    if (!hasMessagingPermission) {
      return false;
    }

    let token = await messaging().getToken();
    if (!token) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      token = await messaging().getToken();
    }

    if (!token) {
      console.error("ensurePushTokenRegistered: FCM token is empty");
      return false;
    }

    await sendToken(token);
    return true;
  } catch (error) {
    console.error("ensurePushTokenRegistered: error", error);
    return false;
  }
};

export const displayNotification = async (remoteMessage: any) => {
  const channelId = await createChannel();

  if (Platform.OS === "ios" && remoteMessage?.data?.route === "Chats") {
    await createCategoriesChatIos();
  }

  const isChatNotification = remoteMessage?.data?.route === "Chats";
  const chatId = remoteMessage?.data?.chatId;
  const groupKey = isChatNotification && chatId ? `Chats` : "";

  // Сохраняем все данные уведомления, включая orderId для навигации
  await notifee.displayNotification({
    title:
      remoteMessage?.data?.title || remoteMessage?.title || "Default title",
    body: remoteMessage?.data?.body || remoteMessage?.body || "Default body",
    data: {
      // Сохраняем все данные из remoteMessage.data для последующей обработки
      ...remoteMessage?.data,
      // Сохраняем route для обратной совместимости
      route: remoteMessage?.data?.route || remoteMessage?.data?.orderId ? "1" : "1",
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

/**
 * Извлекает orderId из данных push-уведомления
 * Поддерживает как новый формат (data.orderId), так и legacy формат (data.route как JSON строка)
 * 
 * @param notificationData - Данные из push-уведомления
 * @returns orderId или null если не найден
 */
export const extractOrderIdFromNotification = (
  notificationData: any
): string | null => {
  if (!notificationData) {
    return null;
  }

  // Приоритет 1: Новый формат - orderId как отдельное поле
  if (notificationData.orderId) {
    return String(notificationData.orderId);
  }

  // Приоритет 2: Legacy формат - route как JSON строка
  if (notificationData.route) {
    try {
      const parsed = JSON.parse(notificationData.route);
      if (typeof parsed === "object" && parsed !== null && parsed.orderId) {
        return String(parsed.orderId);
      }
      if (typeof parsed === "string") {
        // Если route это просто строка маршрута, пытаемся извлечь orderId из query параметров
        const match = parsed.match(/orderId=([^&]+)/);
        if (match && match[1]) {
          return match[1];
        }
      }
    } catch (error) {
      // Если не JSON, логируем предупреждение для диагностики
      console.warn(
        "[extractOrderIdFromNotification] Failed to parse route as JSON (invalid format):",
        error
      );
      console.warn(
        "[extractOrderIdFromNotification] Route value:",
        notificationData.route
      );
    }
  }

  // Если orderId не найден ни в одном формате
  console.warn(
    "[extractOrderIdFromNotification] No orderId found in notification data"
  );
  return null;
};

/**
 * Строит маршрут навигации на экран деталей заказа
 * 
 * @param orderId - Идентификатор заказа
 * @returns Объект маршрута для expo-router с pathname и params
 */
export const buildOrderDetailsRoute = (
  orderId: string,
  role?: UserRole.CUSTOMER | UserRole.CURRIER | null,
): { pathname: any; params: { orderId: string } } => {
  if (!orderId) {
    throw new Error("orderId is required to build order details route");
  }
  
  // Валидация UUID перед построением маршрута
  if (!isValidUUID(orderId)) {
    throw new Error(`Invalid orderId format: ${orderId}. Expected UUID format.`);
  }
  
  return {
    pathname:
      role === UserRole.CUSTOMER
        ? ('/(client)/order-details' as any)
        : ('/(protected)/order-details' as any),
    params: { orderId }
  };
};
