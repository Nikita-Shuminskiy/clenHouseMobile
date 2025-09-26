import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { authApi } from '../api';
import { RefreshTokensRequest } from '../types';
import { removeRefreshToken, removeToken, setRefreshToken, setToken } from '@/src/shared/utils/token';

export const useRefreshTokens = () => {
    return useMutation({
        mutationFn: (data: RefreshTokensRequest) => authApi.refreshTokens(data),
        onSuccess: (data) => {
            setToken(data.accessToken);
            setRefreshToken(data.refreshToken);
        },
        onError: (error: any) => {
            console.error('Ошибка обновления токенов:', error);

            toast.error('Сессия истекла', {
                description: 'Пожалуйста, войдите в систему заново',
                duration: 5000,
            });

            // При ошибке обновления токенов очищаем токены
            removeToken();
            removeRefreshToken();
        },
    });
};
