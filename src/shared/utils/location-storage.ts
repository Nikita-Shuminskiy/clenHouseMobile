import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_STORAGE_KEY = 'userLocation';

export interface StoredLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

/**
 * Сохраняет локацию пользователя в AsyncStorage
 * Используется для поиска ближайших заказов курьеру
 * @param latitude - широта
 * @param longitude - долгота
 */
export async function saveLocationToStorage(
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    const location: StoredLocation = {
      latitude,
      longitude,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.error('Ошибка при сохранении локации:', error);
  }
}

/**
 * Получает сохраненную локацию из AsyncStorage
 * Используется для поиска ближайших заказов курьеру
 * @returns Promise<StoredLocation | null> - сохраненная локация или null
 */
export async function getLocationFromStorage(): Promise<StoredLocation | null> {
  try {
    const locationString = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
    if (!locationString) {
      return null;
    }
    return JSON.parse(locationString) as StoredLocation;
  } catch (error) {
    console.error('Ошибка при получении локации из хранилища:', error);
    return null;
  }
}

/**
 * Удаляет сохраненную локацию из AsyncStorage
 */
export async function removeLocationFromStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch (error) {
    console.error('Ошибка при удалении локации из хранилища:', error);
  }
}

