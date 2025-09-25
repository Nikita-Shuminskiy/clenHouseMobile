// Store для управления состоянием авторизации
import { IUserDto } from "@/src/shared/api/types/data-contracts";
import { AuthState, RegistrationData } from "@/src/shared/types/auth";
import {
  getStorageIsFirstEnter,
  setStorageIsFirstEnter,
} from "@/src/shared/utils/isFirstEnter";
import { removeRefreshToken, removeToken } from "@/src/shared/utils/token";
import { create } from "zustand";

interface AuthStore extends AuthState {
  logout: () => Promise<void>;
  setUser: (user: IUserDto) => void;
  setIsFirstEnter: (isFirstEnter: boolean) => void;
  setAuth: (user: IUserDto) => void;
  setIsInitialized: () => void;
  setRegistrationData: (registrationData: RegistrationData) => void;
  setCheckingAuth: (isChecking: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  isFirstEnter: true,
  registrationData: null,

  setRegistrationData: (registrationData: RegistrationData) => {
    set({ registrationData });
  },

  setCheckingAuth: (isChecking: boolean) => {
    set({ isCheckingAuth: isChecking });
  },

  setIsInitialized: () => {
    getStorageIsFirstEnter().then((isFirstEnter) => {
      set({ isInitialized: true, isFirstEnter: isFirstEnter !== "false" });
    });
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await removeToken();
      await removeRefreshToken();
      set({
        isAuthenticated: false,
        user: null,
        registrationData: null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setIsFirstEnter: (isFirstEnter: boolean) => {
    console.log("isFirstEnter", isFirstEnter);
    setStorageIsFirstEnter(isFirstEnter).then(() => {
      set({ isFirstEnter });
    });
  },

  setUser: (user: IUserDto) => {
    set({ user, isAuthenticated: true });
  },

  setAuth: (user: IUserDto) => {
    console.log("user", user);
    set({
      registrationData: {
        name: user.name,
        email: user.email,
        password: "",
        role: user.role as "owner" | "club_admin",
        cityId: user.cityId,
      },
    });
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      isCheckingAuth: false,
    });
  },
}));
