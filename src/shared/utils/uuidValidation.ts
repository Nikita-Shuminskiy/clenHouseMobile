/**
 * Проверяет, является ли строка валидным UUID
 * @param value - строка для проверки
 * @returns true если строка является валидным UUID
 */
export const isValidUUID = (value: string | null | undefined): boolean => {
  if (!value || typeof value !== 'string') {
    return false;
  }

  // UUID v4 формат: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value.trim());
};

/**
 * Нормализует orderId - извлекает первый элемент если это массив, обрезает пробелы
 * @param orderId - orderId из параметров навигации
 * @returns нормализованный orderId или null
 */
export const normalizeOrderId = (orderId: string | string[] | null | undefined): string | null => {
  if (!orderId) {
    return null;
  }

  // Если это массив, берем первый элемент
  if (Array.isArray(orderId)) {
    return orderId[0]?.trim() || null;
  }

  // Если это строка, обрезаем пробелы
  if (typeof orderId === 'string') {
    const trimmed = orderId.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return null;
};
