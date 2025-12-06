/**
 * Радиус Земли в метрах
 */
const EARTH_RADIUS_METERS = 6371000;

/**
 * Интерфейс для координат точки
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Вычисляет расстояние между двумя точками на поверхности Земли
 * используя формулу Haversine
 * 
 * @param point1 - координаты первой точки (широта, долгота)
 * @param point2 - координаты второй точки (широта, долгота)
 * @returns расстояние в метрах
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const { latitude: lat1, longitude: lon1 } = point1;
  const { latitude: lat2, longitude: lon2 } = point2;

  // Преобразуем градусы в радианы
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Формула Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Расстояние в метрах
  return Math.round(EARTH_RADIUS_METERS * c);
}

/**
 * Преобразует градусы в радианы
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Форматирует расстояние для отображения
 * 
 * @param distanceMeters - расстояние в метрах
 * @returns отформатированная строка (например, "1.5 км" или "250 м")
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${distanceMeters} м`;
  }

  const kilometers = distanceMeters / 1000;
  
  // Если расстояние меньше 10 км, показываем с одним знаком после запятой
  if (kilometers < 10) {
    return `${kilometers.toFixed(1)} км`;
  }

  // Для больших расстояний округляем до целого
  return `${Math.round(kilometers)} км`;
}

