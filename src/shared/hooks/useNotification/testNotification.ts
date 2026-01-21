import { router } from "expo-router";
import { extractOrderIdFromNotification, buildOrderDetailsRoute } from "./utils";
import { isAppReadyForNavigation } from "@/src/shared/utils/navigationReady";
import { isValidUUID } from "@/src/shared/utils/uuidValidation";
import Constants from "expo-constants";

// Глобальное состояние готовности (синхронизируется с useNotification)
let globalIsNavigationReady = false;
let globalIsAuthorized = false;

/**
 * Устанавливает глобальное состояние готовности навигации для тестирования
 */
export const setTestNavigationReadyState = (
  isReady: boolean,
  isAuthorized: boolean
) => {
  globalIsNavigationReady = isReady;
  globalIsAuthorized = isAuthorized;
};

/**
 * Проверяет, находится ли приложение в dev режиме
 */
const isDevMode = () => {
  return __DEV__ || Constants.expoConfig?.extra?.eas?.projectId;
};

/**
 * Симулирует получение push-уведомления для тестирования
 * 
 * @param orderId - ID заказа для навигации
 * @param notificationData - Опциональные дополнительные данные уведомления
 */
export const simulatePushNotification = async (
  orderId: string,
  notificationData?: any
) => {
  if (!isDevMode()) {
    console.warn("[TEST] simulatePushNotification доступна только в dev режиме");
    return;
  }
  try {
    console.log("[TEST] Simulating push notification with orderId:", orderId);

    // Формируем данные уведомления
    const mockNotificationData = {
      orderId: orderId,
      title: "Тестовое уведомление",
      body: `Тестовое сообщение для заказа ${orderId}`,
      ...notificationData,
    };

    // Извлекаем orderId из данных уведомления
    const extractedOrderId = extractOrderIdFromNotification(mockNotificationData);

    if (!extractedOrderId) {
      console.warn("[TEST] No orderId found in notification data");
      console.warn("[TEST] Notification data:", JSON.stringify(mockNotificationData, null, 2));
      return;
    }

    console.log("[TEST] Extracted orderId:", extractedOrderId, "Type:", typeof extractedOrderId);

    // Валидация UUID перед навигацией
    if (!isValidUUID(extractedOrderId)) {
      console.warn("[TEST] Invalid orderId format (not UUID):", extractedOrderId);
      console.warn("[TEST] Navigation will be skipped. Use valid UUID format for testing.");
      return;
    }

    // Проверяем готовность приложения
    const isReady = isAppReadyForNavigation(
      globalIsNavigationReady,
      globalIsAuthorized
    );

    if (!isReady) {
      console.warn("[TEST] App not ready for navigation");
      console.warn("[TEST] isNavigationReady:", globalIsNavigationReady, "isAuthorized:", globalIsAuthorized);
      return;
    }

    // Строим маршрут
    const route = buildOrderDetailsRoute(extractedOrderId);
    console.log("[TEST] Built route:", JSON.stringify(route, null, 2));

    // Выполняем навигацию
    try {
      router.push(route as any);
      console.log("[TEST] Navigation executed successfully");
    } catch (error) {
      console.error("[TEST] Navigation error:", error);
      const fullPath = `${route.pathname}?${Object.entries(route.params || {})
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join("&")}`;
      console.error("[TEST] Attempted route:", fullPath);
      throw error;
    }
  } catch (error) {
    console.error("[TEST] Error simulating push notification:", error);
    throw error;
  }
};
