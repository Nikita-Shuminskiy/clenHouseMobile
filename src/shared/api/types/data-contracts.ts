export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  CURRIER = 'currier',
}


export type IUserDto = {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  isPhoneVerified: boolean;
  email?: string;
  isEmailVerified: boolean;
  hash_password: string;
  refreshTokenHash?: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
};


export type RegisterEmailDto = {
  name: string;
  email: string;
  password: string;
}

export type LoginEmailDto = {
  email: string;
  password: string;
}

export type RegisterResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: IUserDto;
}

// Сброс пароля
export type ResetPasswordRequestDto = {
  email: string;
};

export type ResetPasswordRequestResponseDto = {
  success: boolean;
  message?: string;
};

export type VerifyResetCodeDto = {
  email: string;
  code: string;
};

export type VerifyResetCodeResponseDto = {
  success: boolean;
  message?: string;
};

export type ResetPasswordDto = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordResponseDto = {
  success: boolean;
  message?: string;
};

export type ResetPasswordRequestApiRequest = {
  url: string;
  body: ResetPasswordRequestDto;
};

export type VerifyResetCodeApiRequest = {
  url: string;
  body: VerifyResetCodeDto;
};

export type ResetPasswordApiRequest = {
  url: string;
  body: ResetPasswordDto;
};

// Завершение регистрации
export type CompleteRegistrationDto = {
  cityId: number;
  role: 'owner';
};

export type CompleteRegistrationResponseDto = {
  success: boolean;
  message?: string;
};

export type CompleteRegistrationApiRequest = {
  url: string;
  body: CompleteRegistrationDto;
};

// Города
export type CityDto = {
  id: number;
  name: string;
  region: string;
};

export type GetCitiesResponseDto = CityDto[];

export type GetCitiesApiRequest = {
  url: string;
};