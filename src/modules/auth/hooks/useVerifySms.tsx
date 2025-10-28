import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { authApi } from '../api';
import { VerifySmsRequest } from '../types';
import { router } from 'expo-router';
import { setRefreshToken, setToken } from '@/src/shared/utils/token';

export const useVerifySms = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: VerifySmsRequest) => authApi.verifySms(data),
        onSuccess: async (data) => {
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
                // Сохраняем токены в localStorage
                await setToken(data.accessToken);
                await setRefreshToken(data.refreshToken);

                // Инвалидируем кэш пользователя
                queryClient.invalidateQueries({ queryKey: ['me'] });

                // Показываем успешное уведомление
                toast.success('Добро пожаловать!', {
                    description: `Привет, ${data.user.name}! Вы успешно вошли в систему`,
                    duration: 4000,
                });

                // Перенаправляем в личный кабинет только после успешного сохранения токенов
                router.replace("/(protected-tabs)");
            } catch (error) {
                console.error('Ошибка при сохранении токенов:', error);
                toast.error('Ошибка входа', {
                    description: 'Не удалось сохранить данные авторизации',
                    duration: 5000,
                });
                throw error;
            }
        },
        onError: (error: any) => {
            console.error('Ошибка верификации SMS:', error);

            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'Неверный код подтверждения';

            toast.error('Ошибка входа', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};
