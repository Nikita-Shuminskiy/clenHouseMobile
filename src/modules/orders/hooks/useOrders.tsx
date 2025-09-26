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
}) => {
  return useQuery<OrdersListResponse>({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.findAll(params),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
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
        description: `Статус заказа #${data.id.slice(-8)} изменен на ${
          data.status
        }`,
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
        description: `Заказ #${data.id.slice(-8)} успешно отменен`,
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
