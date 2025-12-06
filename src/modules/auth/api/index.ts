import { instance } from "@/src/shared/api/configs/config";
import {
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  AuthResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  GetMeResponse,
} from "../types";
import { IUserDto } from "@/src/shared/api/types/data-contracts";

export const authApi = {
  // Отправка SMS кода
  sendSms: async (data: SendSmsRequest): Promise<SendSmsResponse> => {
    const payload = {
      phoneNumber: data.phoneNumber,
      ...(data.isDev && { isDev: data.isDev }),
    };
    const response = await instance.post("/auth/sms/send", payload);
    return response.data;
  },

  // Верификация SMS кода и авторизация
  verifySms: async (data: VerifySmsRequest): Promise<AuthResponse> => {
    const response = await instance.post("/auth/sms/verify", data);

    // Проверяем что ответ содержит все необходимые данные
    if (
      !response.data ||
      !response.data.accessToken ||
      !response.data.refreshToken ||
      !response.data.user
    ) {
      throw new Error("Некорректный формат ответа от сервера");
    }

    return response.data;
  },

  // Обновление токенов
  refreshTokens: async (
    data: RefreshTokensRequest
  ): Promise<RefreshTokensResponse> => {
    const response = await instance.post("/auth/refresh", data);
    return response.data;
  },

  // Получение данных текущего пользователя
  getMe: async (): Promise<IUserDto> => {
    const response = await instance.get<GetMeResponse>("/auth/me");
    const data = response.data;
    // Возвращаем только данные пользователя
    return data.user;
  },
};
