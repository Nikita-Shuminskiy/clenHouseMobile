import { OrderResponseDto, OrderStatus } from "@/src/modules/orders/types/orders";

export type PaymentMethod = "online" | "subscription";

export type AddressDetails = {
  building?: number;
  buildingBlock?: string;
  entrance?: string;
  floor?: number;
  apartment?: number;
  domophone?: string;
};

export type AddressSuggestion = {
  value: string;
  unrestricted_value: string;
  display: string;
  city_or_settlement?: string | null;
  street_with_type?: string | null;
  house?: string | null;
  geo_lat?: string | null;
  geo_lon?: string | null;
  [key: string]: unknown;
};

export type UserAddress = {
  id: string;
  userId: string;
  address: AddressSuggestion | null;
  isPrimary: boolean;
  isSupportableArea: boolean;
  addressDetails: AddressDetails | null;
  created_at: string;
  updated_at: string;
};

export type CreateOrderPayload = {
  customerId: string;
  address: string;
  addressId?: string;
  addressDetails?: AddressDetails;
  description?: string;
  scheduledAt?: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  numberPackages?: number;
  coordinates?: {
    geo_lat: string;
    geo_lon: string;
  };
};

export type CustomerOrder = OrderResponseDto;

export type OrderPaymentResponse = {
  paymentUrl: string;
  paymentId: string;
  status: string;
};

export type UniversalPaymentStatus = {
  id: string;
  subscriptionId?: string;
  orderId?: string;
  amount: number;
  status: "pending" | "paid" | "success" | "failed" | "canceled" | "refunded";
  createdAt: string;
};

export type PriceResponse = {
  priceInKopecks: number;
  priceInRubles: number;
  currency: string;
};

export enum SubscriptionStatus {
  PENDING = "pending",
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export type UserSubscription = {
  id: string;
  userId: string;
  type: "monthly" | "yearly";
  price: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  paymentUrl?: string | null;
  ordersLimit?: number;
  usedOrders?: number;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionPlan = {
  id: string;
  type: "monthly" | "yearly";
  name: string;
  description: string;
  priceInKopecks: number;
  priceInRubles?: number;
  duration: string;
  features: string[];
  icon?: string;
  badgeColor?: string;
  popular?: boolean;
  ordersLimit?: number;
  usedOrders?: number;
  finalPriceInKopecks?: number;
  finalPriceInRubles?: number;
  isEligibleForFree?: boolean;
  referralCount?: number;
  hasUsedFreeSubscription?: boolean;
  isReferralFreeEnabled?: boolean;
  minReferralsForFree?: number;
};

export type SubscriptionPaymentResponse = {
  paymentUrl: string | null;
  paymentId: string;
  status: "pending" | "success";
};

export enum ScheduleFrequency {
  DAILY = "daily",
  EVERY_OTHER_DAY = "every_other_day",
  WEEKLY = "weekly",
  CUSTOM = "custom",
}

export type ScheduledOrder = {
  id: string;
  customerId: string;
  address: string;
  addressDetails?: AddressDetails;
  description?: string;
  notes?: string;
  frequency: ScheduleFrequency;
  preferredTime?: string;
  daysOfWeek?: number[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ScheduledOrderPayload = {
  address: string;
  addressDetails?: AddressDetails;
  description?: string;
  notes?: string;
  frequency: ScheduleFrequency;
  preferredTime?: string;
  daysOfWeek?: number[];
  startDate: string;
  endDate?: string;
};

export type CustomerOrderFilter = "all" | OrderStatus | "pending_payment";
