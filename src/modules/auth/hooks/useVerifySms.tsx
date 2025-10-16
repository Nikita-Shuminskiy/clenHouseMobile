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
        onSuccess: (data) => {
            // Сохраняем токены в localStorage
            setToken(data.accessToken).then(() => {
                setRefreshToken(data.refreshToken).then(() => {
                    router.replace("/(protected-tabs)");
                });
            });

            queryClient.invalidateQueries({ queryKey: ['me'] });

            toast.success('Добро пожаловать!', {
                description: `Привет, ${data.user.name}! Вы успешно вошли в систему`,
                duration: 4000,
            });

            // Перенаправляем в личный кабинет
            router.replace("/(protected-tabs)");
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

            // Возвращаем функцию для очистки кода
            return { clearCode: true };
        },
    });
};
