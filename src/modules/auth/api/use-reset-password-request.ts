import { MutationKey } from "../../../shared/api/constants/api-keys/mutation-key";
import { API_ENDPOINTS } from "../../../shared/api/constants/api-endpoints";
import { ApiRequest } from "@/src/shared/api/types/native-types-api";
import { api } from "@/src/shared/api/utils/axios-api-base";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner-native";

export interface ResetPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestResponseDto {
  success: boolean;
  message: string;
}

export const useResetPasswordRequest = () => {
  return useMutation({
    mutationKey: [MutationKey.RESET_PASSWORD_REQUEST],
    mutationFn: resetPasswordRequest,
    onSuccess: (data) => {
      toast.success(data.message || 'Код для сброса пароля отправлен на email');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'Ошибка при отправке кода');
    }
  });
};

type ResetPasswordRequestApiRequest = ApiRequest<"AUTH.RESET_PASSWORD_REQUEST", void, ResetPasswordRequestDto, ResetPasswordRequestResponseDto>;

export const resetPasswordRequest = async (data: ResetPasswordRequestDto): Promise<ResetPasswordRequestResponseDto> => {
  const response = await api.post<ResetPasswordRequestApiRequest>({
    url: API_ENDPOINTS.AUTH.RESET_PASSWORD_REQUEST,
    body: data,
  });
  return response?.data;
};
