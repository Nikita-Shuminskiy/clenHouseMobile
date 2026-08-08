import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { toast } from 'sonner-native';

import { authApi } from '../api';
import type { VerifyTelegramRequest } from '../types';
import { setManualLogoutInProgress } from '@/src/shared/api/configs/config';
import { setRefreshToken, setToken } from '@/src/shared/utils/token';
import { handleApiError } from '@/src/shared/utils/errorHandler';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '@/src/shared/utils/location-permission';
import {
  getHomeRouteForUser,
  isCourierUser,
} from '@/src/shared/utils/role-routing';

const getErrorMessage = (error: unknown, fallback: string): string =>
  handleApiError(error, fallback);

export const useLoginByTelegram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyTelegramRequest) => authApi.verifyTelegram(data),
    onSuccess: async (data) => {
      if (!data || !data.accessToken || !data.refreshToken || !data.user) {
        toast.error('Ошибка входа', {
          description: 'Получены некорректные данные от сервера',
          duration: 5000,
        });
        throw new Error('Некорректный формат ответа от сервера');
      }

      setManualLogoutInProgress(false);
      await setToken(data.accessToken);
      await setRefreshToken(data.refreshToken);

      queryClient.setQueryData(['me'], data.user);

      toast.success('Добро пожаловать!', {
        description: `Привет, ${data.user.name}! Вы успешно вошли через Telegram`,
        duration: 4000,
      });

      if (isCourierUser(data.user)) {
        const hasPermission = await checkLocationPermission();
        if (!hasPermission) {
          await requestLocationPermission();
        }
      }

      router.replace(getHomeRouteForUser(data.user));
    },
    onError: (error: unknown) => {
      toast.error('Ошибка входа', {
        description: getErrorMessage(error, 'Не удалось войти через Telegram'),
        duration: 5000,
      });
    },
  });
};
