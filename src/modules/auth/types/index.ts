import { IUserDto } from "@/src/shared/api/types/data-contracts";

export interface SendSmsRequest {
  phoneNumber: string;
  isDev?: boolean;
}

export interface SendSmsResponse {
  message: string;
  code?: string;
}

export interface VerifySmsRequest {
  phoneNumber: string;
  code: string;
}

export interface AuthResponse {
  user: IUserDto;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GetMeResponse {
  accessToken: string;
  adToken: string | null;
  refreshToken: string;
  user: IUserDto;
}
