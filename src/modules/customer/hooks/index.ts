import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { OrderResponseDto } from "@/src/modules/orders/types/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Linking } from "react-native";
import { toast } from "sonner-native";
import {
  customerAddressApi,
  customerOrdersApi,
  customerPaymentApi,
  customerPriceApi,
  customerScheduledOrdersApi,
  customerSubscriptionsApi,
} from "../api";
import {
  AddressSuggestion,
  CreateOrderPayload,
  ScheduledOrderPayload,
} from "../types";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const typed = error as {
      response?: { data?: { message?: string | string[] } };
      message?: string;
    };
    const message = typed.response?.data?.message;
    if (Array.isArray(message)) return message.join("\n");
    return message || typed.message || fallback;
  }
  return fallback;
};

export const useCustomerOrders = () => {
  const { data: user } = useGetMe();
  return useQuery({
    queryKey: ["customer-orders", user?.id],
    queryFn: () => customerOrdersApi.getCustomerOrders(user!.id),
    enabled: !!user?.id,
    staleTime: 60 * 1000,
    refetchInterval: 90 * 1000,
  });
};

export const useCustomerOrder = (orderId?: string) =>
  useQuery({
    queryKey: ["customer-order", orderId],
    queryFn: () => customerOrdersApi.getOrder(orderId!),
    enabled: !!orderId,
    staleTime: 60 * 1000,
  });

export const useCreateCustomerOrder = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();

  return useMutation({
    mutationFn: (payload: Omit<CreateOrderPayload, "customerId">) =>
      customerOrdersApi.create({ ...payload, customerId: user!.id }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["customer-order", order.id] });
    },
    onError: (error) => {
      toast.error("Не удалось создать заказ", {
        description: getErrorMessage(error, "Попробуйте еще раз"),
      });
    },
  });
};

export const useCreateOrderPayment = () =>
  useMutation({
    mutationFn: ({ orderId, amount }: { orderId: string; amount: number }) =>
      customerOrdersApi.createPayment(orderId, amount),
    onError: (error) => {
      toast.error("Не удалось открыть оплату", {
        description: getErrorMessage(error, "Попробуйте повторить позже"),
      });
    },
  });

export const usePaymentStatus = (paymentId?: string, enabled = true) =>
  useQuery({
    queryKey: ["payment-status", paymentId],
    queryFn: () => customerPaymentApi.getStatus(paymentId!),
    enabled: enabled && !!paymentId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "pending" || !status ? 3000 : false;
    },
  });

export const useAddressSearch = (query: string) =>
  useQuery({
    queryKey: ["address-search", query],
    queryFn: () => customerAddressApi.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });

export const useSavedAddresses = () =>
  useQuery({
    queryKey: ["customer-addresses"],
    queryFn: customerAddressApi.getSaved,
    staleTime: 2 * 60 * 1000,
  });

export const useSaveAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerAddressApi.createSaved,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
    },
  });
};

export const useDeleteSavedAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerAddressApi.removeSaved,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses"] });
    },
  });
};

export const useAddressSupportCheck = () =>
  useMutation({
    mutationFn: (address: AddressSuggestion) =>
      customerAddressApi.isSupportable(address),
  });

export const useOrderPrice = (params?: {
  numberPackages?: number;
  addressId?: string;
}) =>
  useQuery({
    queryKey: ["order-price", params],
    queryFn: () => customerPriceApi.getOrderPrice(params),
    staleTime: 30 * 1000,
  });

export const useCustomerSubscription = () => {
  const { data: user } = useGetMe();
  return useQuery({
    queryKey: ["customer-subscription", user?.id],
    queryFn: () => customerSubscriptionsApi.getUserSubscription(user!.id),
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });
};

export const useSubscriptionPlans = () =>
  useQuery({
    queryKey: ["subscription-plans", "with-prices"],
    queryFn: customerSubscriptionsApi.getPlansWithPrices,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateSubscriptionByPlan = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();
  return useMutation({
    mutationFn: customerSubscriptionsApi.createByPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-subscription", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
    },
    onError: (error) => {
      toast.error("Не удалось создать подписку", {
        description: getErrorMessage(error, "Попробуйте позже"),
      });
    },
  });
};

export const useCreateSubscriptionPayment = () =>
  useMutation({
    mutationFn: ({
      subscriptionId,
      subscriptionType,
      planId,
    }: {
      subscriptionId: string;
      subscriptionType: "monthly" | "yearly";
      planId: string;
    }) =>
      customerSubscriptionsApi.createPayment(
        subscriptionId,
        subscriptionType,
        planId,
      ),
    onError: (error) => {
      toast.error("Не удалось открыть оплату подписки", {
        description: getErrorMessage(error, "Попробуйте позже"),
      });
    },
  });

export const useScheduledOrders = () =>
  useQuery({
    queryKey: ["scheduled-orders"],
    queryFn: customerScheduledOrdersApi.list,
    staleTime: 60 * 1000,
  });

export const useCreateScheduledOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScheduledOrderPayload) =>
      customerScheduledOrdersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-orders"] });
    },
    onError: (error) => {
      toast.error("Не удалось создать расписание", {
        description: getErrorMessage(error, "Проверьте подписку и данные"),
      });
    },
  });
};

export const useToggleScheduledOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive
        ? customerScheduledOrdersApi.deactivate(id)
        : customerScheduledOrdersApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-orders"] });
    },
  });
};

export const useDeleteScheduledOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerScheduledOrdersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-orders"] });
    },
  });
};

export const useRefreshCustomerData = () => {
  const queryClient = useQueryClient();
  const { data: user } = useGetMe();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["customer-orders", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["customer-subscription", user?.id] });
    queryClient.invalidateQueries({ queryKey: ["scheduled-orders"] });
    queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
  };
};

export const openExternalPayment = async (url: string) => {
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    toast.error("Не удалось открыть оплату во внешнем браузере");
    return;
  }
  await Linking.openURL(url);
};

export const getOrderHasPendingPayment = (order: OrderResponseDto) =>
  order.payments?.some((payment) => payment.status === "pending");

export const getOrderIsPaid = (order: OrderResponseDto) =>
  order.payments?.some((payment) => payment.status === "paid") ||
  order.status === "paid";
