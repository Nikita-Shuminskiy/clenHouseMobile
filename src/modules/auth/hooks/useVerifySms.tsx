import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { authApi } from '../api';
import { VerifySmsRequest } from '../types';
import { router } from 'expo-router';
import { setRefreshToken, setToken } from '@/src/shared/utils/token';
import { requestLocationPermission, checkLocationPermission } from '@/src/shared/utils/location-permission';
import { setManualLogoutInProgress } from '@/src/shared/api/configs/config';
import { handleApiError } from '@/src/shared/utils/errorHandler';
import {
    getSavedAuthCredentials,
    saveSavedAuthCredentials,
} from '../utils/saved-auth';
import {
    getHomeRouteForUser,
    isCourierUser,
} from '@/src/shared/utils/role-routing';

export const useVerifySms = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerifySmsRequest) => authApi.verifySms(data),
        onSuccess: async (data, variables) => {
            // Валидация данных ответа - проверяем что все обязательные поля присутствуют
            if (!data || !data.accessToken || !data.refreshToken || !data.user) {
                console.error('Некорректные данные ответа:', data);
                toast.error('Ошибка входа', {
                    description: 'Получены некорректные данные от сервера',
                    duration: 5000,
                });
                throw new Error('Некорректные данные ответа от сервера');
            }

            try {
                setManualLogoutInProgress(false);
                // Сохраняем токены в localStorage
                await setToken(data.accessToken);
                await setRefreshToken(data.refreshToken);

                const existingCredentials = await getSavedAuthCredentials();
                await saveSavedAuthCredentials({
                    method: 'phone',
                    login: variables.phoneNumber,
                    password: existingCredentials?.password ?? '',
                });

                // Устанавливаем данные пользователя в кэш БЕЗ перезапроса
                // Это предотвращает возможную 401 ошибку при refetch сразу после логина
                // которая может привести к очистке токенов в QueryCache onError и редиректу на /(auth)
                queryClient.setQueryData(['me'], data.user);

                // Показываем успешное уведомление
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
            } catch (error) {
                console.error('Ошибка при сохранении токенов:', error);
                toast.error('Ошибка входа', {
                    description: 'Не удалось сохранить данные авторизации',
                    duration: 5000,
                });
                throw error;
            }
        },
        onError: (error) => {
            toast.error('Ошибка входа', {
                description: handleApiError(error, 'Неверный код подтверждения'),
                duration: 5000,
            });
        },
    });
};
