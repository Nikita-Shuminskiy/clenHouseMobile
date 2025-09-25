import { MutationKey } from "../../../shared/api/constants/api-keys/mutation-key";
import { API_ENDPOINTS } from "../../../shared/api/constants/api-endpoints";
import { ApiRequest } from "@/src/shared/api/types/native-types-api";
import { api } from "@/src/shared/api/utils/axios-api-base";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner-native";

export interface ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponseDto {
  success: boolean;
  message: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationKey: [MutationKey.RESET_PASSWORD],
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Пароль успешно изменен');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'Ошибка при сбросе пароля');
    }
  });
};

type ResetPasswordApiRequest = ApiRequest<"AUTH.RESET_PASSWORD", void, ResetPasswordDto, ResetPasswordResponseDto>;

export const resetPassword = async (data: ResetPasswordDto): Promise<ResetPasswordResponseDto> => {
  const response = await api.post<ResetPasswordApiRequest>({
    url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
    body: data,
  });
  
  const result = response?.data;
  
  // Проверяем поле success в ответе
  if (!result?.success) {
    throw new Error(result?.message || 'Ошибка при сбросе пароля');
  }
  
  return result;
};
