import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner-native";
import { ordersApi } from "../api";
import {
  CancelOrderDto,
  OrderResponseDto,
  OrdersListResponse,
  OrderStatus,
  UpdateOrderStatusDto,
} from "../types/orders";
import { useLocation } from "@/src/shared/hooks/useLocation";

interface UseOrderDetailsProps {
  orderId: string;
  enabled?: boolean;
}

export const useOrderDetails = ({
  orderId,
  enabled = true,
}: UseOrderDetailsProps) => {
  return useQuery<OrderResponseDto>({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.findOne(orderId),
    enabled: enabled && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 3,
  });
};

export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
  currierId?: string;
  isOverdue?: boolean;
}) => {
  return useQuery<OrdersListResponse>({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.findAll(params),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

/**
 * Хук для получения ближайших заказов по локации курьера
 * @param params - параметры запроса, включая координаты (lat, lon)
 */
export const useOrdersNearby = (params: {
  lat: number;
  lon: number;
  maxDistance?: number;
  page?: number;
  limit?: number;
  status?: OrderStatus;
  currierId?: string;
  isOverdue?: boolean;
}) => {
  return useQuery<OrdersListResponse>({
    queryKey: ["orders", "nearby", params],
    queryFn: () => ordersApi.findAllNearby(params),
    enabled: !!params.lat && !!params.lon,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
};

/**
 * Умный хук для получения заказов с автоматическим выбором метода
 * Если локация доступна - использует useOrdersNearby (ближайшие заказы)
 * Если локация недоступна - использует useOrders (обычные заказы)
 */
export const useOrderByLocation = (
  params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    customerId?: string;
    currierId?: string;
    maxDistance?: number;
    isOverdue?: boolean;
  },
  options?: {
    enabled?: boolean;
  }
) => {
  const { location, hasPermission } = useLocation();

  const hasLocation = hasPermission && location !== null;

  // Фильтруем undefined значения из параметров перед передачей в API
  const filterUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as Partial<T>;
  };

  const filteredParams = params ? filterUndefined(params) : {};

  if (filteredParams) {
    filteredParams.limit = 100;
  }



  // Используем ближайшие заказы, если есть локация
  const nearbyQuery = useQuery<OrdersListResponse>({
    queryKey: ["orders", "nearby", { ...filteredParams, lat: location?.latitude, lon: location?.longitude }],
    queryFn: () => {
      if (!location?.latitude || !location?.longitude) {
        throw new Error('Локация недоступна');
      }
      return ordersApi.findAllNearby({
        lat: location.latitude,
        lon: location.longitude,
        ...filteredParams,
      } as any);
    },
    enabled: (options?.enabled !== false) && hasLocation && !!location,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    retry: 1,
    retryOnMount: false,
  });

  // Используем обычные заказы, если локации нет или произошла ошибка в nearbyQuery
  const regularQuery = useQuery<OrdersListResponse>({
    queryKey: ["orders", filteredParams],
    queryFn: () => ordersApi.findAll(filteredParams),
    enabled: (options?.enabled !== false) && (!hasLocation || (nearbyQuery.isError && !nearbyQuery.isFetching)),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    retry: 1,
  });

  // Если nearbyQuery упал с ошибкой, используем regularQuery
  if (hasLocation && !nearbyQuery.isError && nearbyQuery.data) {
    return nearbyQuery;
  }

  // Возвращаем regularQuery если нет локации или произошла ошибка
  return regularQuery;
};

export const useOrder = (id: string) => {
  return useQuery<OrderResponseDto>({
    queryKey: ["order", id],
    queryFn: () => ordersApi.findOne(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusDto }) =>
      ordersApi.updateStatus(id, data),
    onSuccess: (data) => {
      toast.success("Статус обновлен!", {
        duration: 4000,
      });

      // Обновляем кэш заказов
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["customer-orders", user?.id],
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        "Ошибка обновления статуса";
      toast.error("Ошибка", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
};

// Отменить заказ
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();

  return useMutation({
    mutationFn: ({
      id,
      cancelOrderDto,
    }: {
      id: string;
      cancelOrderDto: CancelOrderDto;
    }) => ordersApi.cancel(id, cancelOrderDto),
    onSuccess: (data) => {
      toast.success("Заказ отменен!", {
        duration: 4000,
      });

      // Обновляем кэш заказов
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["customer-orders", user?.id],
      });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        "Ошибка отмены заказа";
      toast.error("Ошибка", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.remove(id),
    onSuccess: () => {
      toast.success("Заказ удален!", {
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error?.response?.data as { message?: string })?.message ||
        "Ошибка удаления заказа";
      toast.error("Ошибка", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
};
