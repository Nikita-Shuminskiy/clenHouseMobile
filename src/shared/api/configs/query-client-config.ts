import { QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { errorLogger } from "../utils/logger";
import { removeToken, removeRefreshToken } from "../../utils/token";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // @ts-ignore
    onError: (error: AxiosError<{ message: string }>) => {
      // 401 — ожидаемое состояние "не авторизован": чистим токены без шумного лога
      if (error?.response?.status === 401) {
        removeToken();
        removeRefreshToken();
        return;
      }

      errorLogger('Query error:', error?.response?.data?.message || error.message);
    }
  }),
  defaultOptions: {
    mutations: {
      // @ts-ignore
      onError: (error: AxiosError<{ message: string }>) => {
        // 401 — ожидаемое состояние "не авторизован": чистим токены без шумного лога
        if (error?.response?.status === 401) {
          removeToken();
          removeRefreshToken();
          return;
        }

        errorLogger('Mutation error:', error?.response?.data?.message || error.message);
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
