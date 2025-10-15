import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api";
import { IUserDto } from "@/src/shared/api/types/data-contracts";
import { getToken, removeRefreshToken, removeToken } from "@/src/shared/utils/token";
import { useState, useEffect } from "react";

export const useGetMe = () => {
    const [hasToken, setHasToken] = useState<boolean | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();
            setHasToken(!!token);
        };
        checkToken();
    }, []);

    return useQuery<IUserDto>({
        queryKey: ['me'],
        queryFn: () => authApi.getMe(),
        enabled: hasToken === true, // Выполнять запрос только если есть токен
        staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
        gcTime: 10 * 60 * 1000, // 10 минут - время хранения в кэше
        refetchOnWindowFocus: false, // не перезагружать при фокусе окна
        refetchOnMount: false, // не перезагружать при монтировании
        retry: (failureCount, error: any) => {
            // Не повторять запрос при 401 ошибке - interceptor уже обработает это
            if (error?.response?.status === 401) {
                return false;
            }
            // Повторить максимум 2 раза для других ошибок
            return failureCount < 2;
        },
    })
}
