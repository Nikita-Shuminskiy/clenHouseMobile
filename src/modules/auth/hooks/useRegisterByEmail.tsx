import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { router } from 'expo-router';
import { authApi } from '../api';
import { RegisterRequest } from '../types';
import { setRefreshToken, setToken } from '@/src/shared/utils/token';
import { setManualLogoutInProgress } from '@/src/shared/api/configs/config';
import { saveSavedAuthCredentials } from '../utils/saved-auth';
import { handleApiError } from '@/src/shared/utils/errorHandler';

const getErrorMessage = (error: unknown, fallback: string): string =>
  handleApiError(error, fallback);

export const useRegisterByEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: async (data, variables) => {
      if (!data || !data.accessToken || !data.refreshToken || !data.user) {
        toast.error('Ошибка регистрации', {
          description: 'Получен некорректный ответ от сервера',
          duration: 5000,
        });
        throw new Error('Некорректный формат ответа при регистрации');
      }

      setManualLogoutInProgress(false);
      await setToken(data.accessToken);
      await setRefreshToken(data.refreshToken);
      await saveSavedAuthCredentials({
        method: 'email',
        login: variables.email.trim().toLowerCase(),
        password: variables.password,
      });

      queryClient.setQueryData(['me'], data.user);

      toast.success('Регистрация завершена', {
        description: `Добро пожаловать, ${data.user.name}!`,
        duration: 4000,
      });

      router.replace('/(protected-tabs)');
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        'Не удалось завершить регистрацию',
      );

      toast.error('Ошибка регистрации', {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
};
