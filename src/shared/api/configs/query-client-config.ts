import { QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { errorLogger } from "../utils/logger";
import { removeToken, removeRefreshToken } from "../../utils/token";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // @ts-ignore
    onError: (error: AxiosError<{ message: string }>) => {
      errorLogger('Query error:', error?.response?.data?.message || error.message);
      
      // Очищаем токены при 401 ошибке
      if (error?.response?.status === 401) {
        removeToken();
        removeRefreshToken();
      }
    }
  }),
  defaultOptions: {
    mutations: {
      // @ts-ignore
      onError: (error: AxiosError<{ message: string }>) => {
        errorLogger('Mutation error:', error?.response?.data?.message || error.message);
        
        // Очищаем токены при 401 ошибке
        if (error?.response?.status === 401) {
          removeToken();
          removeRefreshToken();
        }
      }
    },
    queries: {
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});
