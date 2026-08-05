import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';
import { authApi } from '../api';
import { SendSmsRequest } from '../types';
import { handleApiError } from '@/src/shared/utils/errorHandler';

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
        onError: (error) => {
            toast.error('Ошибка отправки SMS', {
                description: handleApiError(error, 'Не удалось отправить SMS-код. Попробуйте ещё раз.'),
                duration: 5000,
            });
        },
    });
};
