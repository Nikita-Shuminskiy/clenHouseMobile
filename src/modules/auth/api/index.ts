import { instance } from "@/src/shared/api/configs/config";
import type {
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  AuthResponse,
  RefreshTokensRequest,
  RefreshTokensResponse,
  GetMeResponse,
  RegisterRequest,
  LoginEmailRequest,
  VerifyTelegramRequest,
} from "../types";
import type { IUserDto } from "@/src/shared/api/types/data-contracts";

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    const response = await instance.post("/auth/register", payload);
    return response.data;
  },

  login: async (data: LoginEmailRequest): Promise<AuthResponse> => {
    const response = await instance.post("/auth/email/login", data);
    return response.data;
  },

  verifyTelegram: async (data: VerifyTelegramRequest): Promise<AuthResponse> => {
    const payload = {
      id: data.id,
      first_name: data.first_name,
      ...(data.last_name && { last_name: data.last_name }),
      ...(data.username && { username: data.username }),
      ...(data.photo_url && { photo_url: data.photo_url }),
      auth_date: data.auth_date,
      hash: data.hash,
      ...(data.adToken && { adToken: data.adToken }),
    };
    const response = await instance.post(
      "/auth/telegram/login-widget/verify",
      payload
    );
    return response.data;
  },

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
