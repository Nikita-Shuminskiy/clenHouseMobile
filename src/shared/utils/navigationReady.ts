/**
 * Утилиты для проверки готовности приложения к навигации
 */

/**
 * Проверяет, готово ли приложение к выполнению навигации
 * Навигация должна выполняться только после:
 * - Скрытия splash screen
 * - Инициализации роутера
 * - Завершения авторизации (если требуется)
 * 
 * @param isNavigationReady - Флаг готовности навигации из _layout.tsx
 * @param isAuthorized - Флаг авторизации пользователя
 * @returns true если приложение готово к навигации
 */
export const isAppReadyForNavigation = (
  isNavigationReady: boolean,
  isAuthorized: boolean
): boolean => {
  return isNavigationReady && isAuthorized;
};

/**
 * Создает функцию для проверки готовности с учетом состояния приложения
 * Используется в хуках и компонентах для синхронизации навигации
 */
export const createNavigationReadyChecker = (
  getIsNavigationReady: () => boolean,
  getIsAuthorized: () => boolean
) => {
  return (): boolean => {
    return isAppReadyForNavigation(
      getIsNavigationReady(),
      getIsAuthorized()
    );
  };
};
