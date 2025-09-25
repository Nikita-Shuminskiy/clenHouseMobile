/*
import { MutationKey } from "../../../shared/api/constants/api-keys/mutation-key";
import { ApiRequest } from "@/src/shared/api/types/native-types-api";
import { api } from "@/src/shared/api/utils/axios-api-base";
import { showToast } from "@/src/shared/utils/show-toast";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
*/

export interface ForgotPasswordDto {
  email: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
  success: boolean;
}

export const useForgotPassword = () => {
  return {
    mutateAsync: async (data: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        message: 'Письмо отправлено на указанный email',
        success: true
      };
    }
  };
};

export const forgotPassword = async (data: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> => {
  return Promise.resolve({
    message: 'Письмо отправлено на указанный email',
    success: true
  });
};
