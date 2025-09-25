import { MutationKey } from "../../../shared/api/constants/api-keys/mutation-key";
import { API_ENDPOINTS } from "../../../shared/api/constants/api-endpoints";
import { ApiRequest } from "@/src/shared/api/types/native-types-api";
import { api } from "@/src/shared/api/utils/axios-api-base";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner-native";

export interface VerifyResetCodeDto {
  email: string;
  code: string;
}

export interface VerifyResetCodeResponseDto {
  success: boolean;
  message: string;
}

export const useVerifyResetCode = () => {
  return useMutation({
    mutationKey: [MutationKey.VERIFY_RESET_CODE],
    mutationFn: verifyResetCode,
    onSuccess: (data) => {
      toast.success(data.message || 'Код подтвержден. Можете установить новый пароль');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'Неверный код или код истек');
    }
  });
};

type VerifyResetCodeApiRequest = ApiRequest<"AUTH.VERIFY_RESET_CODE", void, VerifyResetCodeDto, VerifyResetCodeResponseDto>;

export const verifyResetCode = async (data: VerifyResetCodeDto): Promise<VerifyResetCodeResponseDto> => {
  const response = await api.post<VerifyResetCodeApiRequest>({
    url: API_ENDPOINTS.AUTH.VERIFY_RESET_CODE,
    body: data,
  });
  
  const result = response?.data;
  
  // Проверяем поле success в ответе
  if (!result?.success) {
    throw new Error(result?.message || 'Неверный код или код истек');
  }
  
  return result;
};
