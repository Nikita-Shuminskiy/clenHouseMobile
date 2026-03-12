import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { authApi } from '../api';
import { SendSmsRequest } from '../types';

export const useSendSms = () => {
    return useMutation({
        mutationFn: (data: SendSmsRequest) => authApi.sendSms(data),
        onSuccess: (_, variables) => {
            const isDev = variables.isDev;
            toast.success('SMS код отправлен!', {
                description: isDev
                    ? 'Режим разработки: код отправлен в консоль'
                    : 'Проверьте ваш телефон и введите полученный код',
                duration: 5000,
            });
        },
        onError: (error: any) => {
            console.error('Ошибка отправки SMS:', error);

            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'Произошла ошибка при отправке SMS кода';

            toast.error('Ошибка отправки SMS', {
                description: errorMessage,
                duration: 5000,
            });
        },
    });
};
