import { IUserDto } from "../api/types/data-contracts";

export interface AuthState {
  isAuthenticated: boolean;
  user: IUserDto | null;
  isInitialized: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  isFirstEnter: boolean;
  registrationData: RegistrationData | null;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  cityId?: number;
  role?: "owner" | "club_admin";
}
