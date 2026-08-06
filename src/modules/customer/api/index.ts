import { instance } from "@/src/shared/api/configs/config";
import {
  AddressDetails,
  AddressSuggestion,
  CreateOrderPayload,
  OrderPaymentResponse,
  PriceResponse,
  ScheduledOrder,
  ScheduledOrderPayload,
  SubscriptionPaymentResponse,
  SubscriptionPlan,
  UniversalPaymentStatus,
  UserAddress,
  UserSubscription,
} from "../types";
import { OrderResponseDto } from "@/src/modules/orders/types/orders";

export const customerOrdersApi = {
  create: async (payload: CreateOrderPayload): Promise<OrderResponseDto> => {
    const response = await instance.post("/orders", payload);
    return response.data;
  },

  getCustomerOrders: async (customerId: string): Promise<OrderResponseDto[]> => {
    const response = await instance.get(`/orders/customer/${customerId}`);
    return response.data;
  },

  getOrder: async (orderId: string): Promise<OrderResponseDto> => {
    const response = await instance.get(`/orders/${orderId}`);
    return response.data;
  },

  createPayment: async (
    orderId: string,
    amount: number,
  ): Promise<OrderPaymentResponse> => {
    const response = await instance.post("/orders/payment/create", {
      orderId,
      amount,
    });
    return response.data;
  },
};

export const customerPaymentApi = {
  getStatus: async (paymentId: string): Promise<UniversalPaymentStatus> => {
    const response = await instance.get(`/payment-status/${paymentId}`);
    return response.data;
  },
};

export const customerAddressApi = {
  search: async (query: string): Promise<AddressSuggestion[]> => {
    const response = await instance.get("/address", { params: { query } });
    return response.data;
  },

  isSupportable: async (address: AddressSuggestion): Promise<boolean> => {
    const response = await instance.post("/address/is-supportable", address);
    return response.data;
  },

  getSaved: async (): Promise<UserAddress[]> => {
    const response = await instance.get("/user-address");
    return response.data;
  },

  createSaved: async (payload: {
    address: AddressSuggestion;
    addressDetails?: AddressDetails;
    isPrimary?: boolean;
    isSupportableArea?: boolean;
  }): Promise<UserAddress> => {
    const response = await instance.post("/user-address", payload);
    return response.data;
  },

  removeSaved: async (id: string): Promise<void> => {
    await instance.delete(`/user-address/${id}`);
  },
};

export const customerPriceApi = {
  getOrderPrice: async (params?: {
    numberPackages?: number;
    addressId?: string;
  }): Promise<PriceResponse> => {
    const response = await instance.get("/price/order", { params });
    return response.data;
  },
};

export const customerSubscriptionsApi = {
  getPlansWithPrices: async (): Promise<SubscriptionPlan[]> => {
    const response = await instance.get("/subscription-plans/client/with-prices");
    return response.data;
  },

  getUserSubscription: async (
    userId: string,
  ): Promise<UserSubscription | null> => {
    const response = await instance.get<{ subscriptions: UserSubscription[] }>(
      "/subscriptions",
      { params: { userId } },
    );
    const subscriptions = response.data.subscriptions ?? [];
    return (
      subscriptions.find((subscription) => subscription.status === "active") ??
      subscriptions[0] ??
      null
    );
  },

  createByPlan: async (planId: string): Promise<UserSubscription> => {
    const response = await instance.post("/subscriptions/by-plan", { planId });
    return response.data;
  },

  createPayment: async (
    subscriptionId: string,
    subscriptionType: "monthly" | "yearly",
    planId: string,
  ): Promise<SubscriptionPaymentResponse> => {
    const response = await instance.post("/subscriptions/payment/create", {
      subscriptionId,
      subscriptionType,
      planId,
    });
    return response.data;
  },

  delete: async (subscriptionId: string): Promise<void> => {
    await instance.delete(`/subscriptions/${subscriptionId}`);
  },
};

export const customerScheduledOrdersApi = {
  list: async (): Promise<ScheduledOrder[]> => {
    const response = await instance.get("/scheduled-orders/my-schedules");
    return response.data;
  },

  create: async (payload: ScheduledOrderPayload): Promise<ScheduledOrder> => {
    const response = await instance.post("/scheduled-orders", payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<ScheduledOrderPayload> & { isActive?: boolean },
  ): Promise<ScheduledOrder> => {
    const response = await instance.patch(`/scheduled-orders/${id}`, payload);
    return response.data;
  },

  activate: async (id: string): Promise<ScheduledOrder> => {
    const response = await instance.patch(`/scheduled-orders/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: string): Promise<ScheduledOrder> => {
    const response = await instance.patch(`/scheduled-orders/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/scheduled-orders/${id}`);
  },
};
