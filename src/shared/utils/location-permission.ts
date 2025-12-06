import * as Location from 'expo-location';

/**
 * Запрашивает разрешение на использование геолокации
 * Используется для поиска ближайших заказов курьеру
 * @returns Promise<boolean> - true если разрешение предоставлено, false в противном случае
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Ошибка при запросе разрешения на геолокацию:', error);
    return false;
  }
}

/**
 * Проверяет текущий статус разрешения на геолокацию
 * Используется для поиска ближайших заказов курьеру
 * @returns Promise<boolean> - true если разрешение уже предоставлено, false в противном случае
 */
export async function checkLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Ошибка при проверке разрешения на геолокацию:', error);
    return false;
  }
}

