import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { router } from 'expo-router';
import { authApi } from '../api';
import { LoginEmailRequest } from '../types';
import {
  setRefreshToken,
  setToken,
} from '@/src/shared/utils/token';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '@/src/shared/utils/location-permission';
import { setManualLogoutInProgress } from '@/src/shared/api/configs/config';
import { saveSavedAuthCredentials } from '../utils/saved-auth';
import { handleApiError } from '@/src/shared/utils/errorHandler';
import {
  getHomeRouteForUser,
  isCourierUser,
} from '@/src/shared/utils/role-routing';

const getErrorMessage = (error: unknown, fallback: string): string =>
  handleApiError(error, fallback);

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

      if (isCourierUser(data.user)) {
        const hasPermission = await checkLocationPermission();
        if (!hasPermission) {
          await requestLocationPermission();
        }
      }

      router.replace(getHomeRouteForUser(data.user));
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
