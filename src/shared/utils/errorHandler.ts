import axios from 'axios';

/**
 * Обрабатывает ошибки API и возвращает понятное пользователю сообщение.
 * Учитывает: отсутствие соединения, таймаут, message в виде массива
 * (ошибки валидации NestJS) и обычные строковые сообщения.
 */
export const handleApiError = (error: unknown, fallbackMessage: string): string => {
  if (axios.isAxiosError(error)) {
    // Нет ответа от сервера — проблема с сетью, а не с данными
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return 'Превышено время ожидания ответа. Попробуйте ещё раз.';
      }
      return 'Нет соединения с сервером. Проверьте подключение к интернету.';
    }

    const data = error.response.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    // NestJS возвращает message массивом при ошибках валидации
    if (Array.isArray(data?.message)) {
      const joined = data!.message.filter(Boolean).join('\n');
      if (joined) return joined;
    } else if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.error === 'string' && data.error.trim()) {
      return data.error;
    }

    return fallbackMessage;
  }

  return (error as Error)?.message || fallbackMessage;
};

/**
 * Проверяет, является ли ошибка Axios ошибкой
 */
export const isAxiosError = (error: unknown): boolean => {
  return axios.isAxiosError(error);
};

/**
 * Получает статус код ошибки
 */
export const getErrorStatus = (error: unknown): number | undefined => {
  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
};

/**
 * Получает данные ответа с ошибкой
 */
export const getErrorData = (error: unknown): unknown => {
  if (axios.isAxiosError(error)) {
    return error.response?.data;
  }
  return null;
}; 