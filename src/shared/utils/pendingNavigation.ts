import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_NAVIGATION_KEY = "pendingNotificationNavigation";
const PENDING_AUTH_NAVIGATION_KEY = "pendingAuthNavigation";

export interface PendingNavigationState {
  orderId: string;
  timestamp: number;
  source: "push_notification";
}

/**
 * Сохраняет состояние отложенной навигации в AsyncStorage
 * Используется когда приложение не готово или авторизация не завершена
 */
export const savePendingNavigation = async (
  orderId: string,
  source: "push_notification" = "push_notification"
): Promise<void> => {
  try {
    const pendingState: PendingNavigationState = {
      orderId,
      timestamp: Date.now(),
      source,
    };
    await AsyncStorage.setItem(
      PENDING_NAVIGATION_KEY,
      JSON.stringify(pendingState)
    );
    console.log(
      `[PendingNavigation] Saved pending navigation: orderId=${orderId}`
    );
  } catch (error) {
    console.error("[PendingNavigation] Error saving pending navigation:", error);
    throw error;
  }
};

/**
 * Сохраняет состояние отложенной навигации для случая истекшей авторизации
 */
export const savePendingAuthNavigation = async (
  orderId: string
): Promise<void> => {
  try {
    const pendingState: PendingNavigationState = {
      orderId,
      timestamp: Date.now(),
      source: "push_notification",
    };
    await AsyncStorage.setItem(
      PENDING_AUTH_NAVIGATION_KEY,
      JSON.stringify(pendingState)
    );
    console.log(
      `[PendingNavigation] Saved pending auth navigation: orderId=${orderId}`
    );
  } catch (error) {
    console.error(
      "[PendingNavigation] Error saving pending auth navigation:",
      error
    );
    throw error;
  }
};

/**
 * Загружает состояние отложенной навигации из AsyncStorage
 * Возвращает null если нет сохраненного состояния или оно истекло (старше 5 минут)
 */
export const loadPendingNavigation = async (): Promise<PendingNavigationState | null> => {
  try {
    const stored = await AsyncStorage.getItem(PENDING_NAVIGATION_KEY);
    if (!stored) {
      return null;
    }

    const pendingState: PendingNavigationState = JSON.parse(stored);
    const now = Date.now();
    const age = now - pendingState.timestamp;

    // Очищаем устаревшие записи (старше 5 минут)
    if (age > 5 * 60 * 1000) {
      console.log(
        `[PendingNavigation] Pending navigation expired (age: ${age}ms), clearing`
      );
      await clearPendingNavigation();
      return null;
    }

    console.log(
      `[PendingNavigation] Loaded pending navigation: orderId=${pendingState.orderId}`
    );
    return pendingState;
  } catch (error) {
    console.error("[PendingNavigation] Error loading pending navigation:", error);
    return null;
  }
};

/**
 * Загружает состояние отложенной навигации для случая авторизации
 */
export const loadPendingAuthNavigation = async (): Promise<PendingNavigationState | null> => {
  try {
    const stored = await AsyncStorage.getItem(PENDING_AUTH_NAVIGATION_KEY);
    if (!stored) {
      return null;
    }

    const pendingState: PendingNavigationState = JSON.parse(stored);
    const now = Date.now();
    const age = now - pendingState.timestamp;

    // Очищаем устаревшие записи (старше 5 минут)
    if (age > 5 * 60 * 1000) {
      console.log(
        `[PendingNavigation] Pending auth navigation expired (age: ${age}ms), clearing`
      );
      await clearPendingAuthNavigation();
      return null;
    }

    console.log(
      `[PendingNavigation] Loaded pending auth navigation: orderId=${pendingState.orderId}`
    );
    return pendingState;
  } catch (error) {
    console.error(
      "[PendingNavigation] Error loading pending auth navigation:",
      error
    );
    return null;
  }
};

/**
 * Очищает состояние отложенной навигации из AsyncStorage
 */
export const clearPendingNavigation = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PENDING_NAVIGATION_KEY);
    console.log("[PendingNavigation] Cleared pending navigation");
  } catch (error) {
    console.error(
      "[PendingNavigation] Error clearing pending navigation:",
      error
    );
  }
};

/**
 * Очищает состояние отложенной навигации для случая авторизации
 */
export const clearPendingAuthNavigation = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PENDING_AUTH_NAVIGATION_KEY);
    console.log("[PendingNavigation] Cleared pending auth navigation");
  } catch (error) {
    console.error(
      "[PendingNavigation] Error clearing pending auth navigation:",
      error
    );
  }
};
