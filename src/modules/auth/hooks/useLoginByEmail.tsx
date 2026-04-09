import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { router } from 'expo-router';
import { authApi } from '../api';
import { LoginEmailRequest } from '../types';
import {
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from '@/src/shared/utils/token';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '@/src/shared/utils/location-permission';
import { UserRole } from '@/src/shared/api/types/data-contracts';
import { setManualLogoutInProgress } from '@/src/shared/api/configs/config';
import { saveSavedAuthCredentials } from '../utils/saved-auth';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object') {
    const typedError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return typedError.response?.data?.message || typedError.message || fallback;
  }
  return fallback;
};

export const useLoginByEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginEmailRequest) => authApi.login(data),
    onSuccess: async (data, variables) => {
      if (!data || !data.accessToken || !data.refreshToken || !data.user) {
        toast.error('Ошибка входа', {
          description: 'Получены некорректные данные от сервера',
          duration: 5000,
        });
        throw new Error('Некорректный формат ответа от сервера');
      }

      if (!data.user.roles?.includes(UserRole.CURRIER)) {
        await removeToken();
        await removeRefreshToken();
        toast.error('Доступ запрещен', {
          description: 'Мобильное приложение доступно только для курьеров',
          duration: 5000,
        });
        throw new Error('Доступ разрешен только для курьеров');
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

      toast.success('Добро пожаловать!', {
        description: `Привет, ${data.user.name}! Вы успешно вошли в систему`,
        duration: 4000,
      });

      const hasPermission = await checkLocationPermission();
      if (!hasPermission) {
        await requestLocationPermission();
      }

      router.replace('/(protected-tabs)');
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error, 'Не удалось войти по email');
      toast.error('Ошибка входа', {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
};
