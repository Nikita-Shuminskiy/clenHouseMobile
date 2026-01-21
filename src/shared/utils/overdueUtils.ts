/**
 * Форматирует время просрочки в читаемый формат
 * @param minutes - количество минут просрочки
 * @returns строка в формате "N мин/ч/дн"
 */
export const formatOverdueTime = (minutes: number | undefined): string => {
  if (!minutes || minutes < 0) {
    return "0 мин";
  }

  if (minutes < 60) {
    return `${minutes} мин`;
  }

  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `${hours} ч`;
  }

  const days = Math.floor(minutes / 1440);
  return `${days} дн`;
};
