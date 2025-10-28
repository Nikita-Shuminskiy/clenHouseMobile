// Утилиты для форматирования
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPriceFromRubles = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Конвертирует цену из копеек в рубли и возвращает число
 * @param priceInKopecks - цена в копейках
 * @returns цена в рублях
 */
export const kopecksToRubles = (priceInKopecks: number): number => {
  return priceInKopecks / 100;
};

/**
 * Конвертирует цену из копеек в рубли и возвращает строку с символом рубля
 * @param priceInKopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns строка с ценой в рублях
 */
export const kopecksToRublesString = (
  priceInKopecks: number,
  showDecimals: boolean = false
): string => {
  const rubles = priceInKopecks / 100;

  if (showDecimals) {
    return `₽${rubles.toFixed(2)}`;
  }

  return `₽${Math.round(rubles)}`;
};

/**
 * Конвертирует цену из копеек в рубли и возвращает только число без символа валюты
 * @param priceInKopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns число в рублях
 */
export const kopecksToRublesNumber = (
  priceInKopecks: number,
  showDecimals: boolean = false
): number => {
  const rubles = priceInKopecks / 100;

  if (showDecimals) {
    return parseFloat(rubles.toFixed(2));
  }

  return Math.round(rubles);
};

/**
 * Форматирует цену для отображения в UI
 * @param priceInKopecks - цена в копейках
 * @param showDecimals - показывать ли десятичные знаки (по умолчанию false)
 * @returns отформатированная строка с ценой
 */
export const formatPrice = (
  priceInKopecks: number,
  showDecimals: boolean = false
): string => {
  const rubles = priceInKopecks / 100;

  if (showDecimals) {
    return `${rubles.toFixed(2)}₽`;
  }

  return `${Math.round(rubles)}₽`;
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }
  return phone;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

