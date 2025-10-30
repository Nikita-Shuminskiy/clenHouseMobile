export enum OrderStatus {
  NEW = "new",
  PAID = "paid",
  ASSIGNED = "assigned",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  CANCELED = "canceled",
}

export interface CreateOrderDto {
  customerId: string;
  description: string;
  address: string;
  phone: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  currierId?: string;
}

export interface PaymentDto {
  id: string;
  orderId: string;
  amount: string;
  status: string;
  method: string;
  createdAt: string;
}

export interface UserDto {
  id: string;
  role: string;
  name: string;
  phone: string;
  isPhoneVerified: boolean;
  email: string | null;
  isEmailVerified: boolean;
  hash_password: string | null;
  refreshTokenHash: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDetailsDto {
  floor?: number;
  building?: number;
  entrance?: string;
  apartment?: number;
  buildingBlock?: string;
  domophone?: string;
}

export interface OrderResponseDto {
  id: string;
  customer: UserDto;
  currier: UserDto | null;
  address: string;
  description: string;
  price: string;
  status: OrderStatus;
  scheduledAt: string;
  notes: string;
  payments: PaymentDto[];
  coordinates?: {
    lat: number;
    lon: number;
  };
  addressDetails?: AddressDetailsDto;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersListResponse {
  orders: OrderResponseDto[];
  total: number;
}

export interface TakeOrderDto {
  courierId: string;
}

export interface StartOrderDto {
  courierId: string;
}

export interface CompleteOrderDto {
  courierId: string;
}

export interface CancelOrderDto {
  courierId: string;
  reason?: string;
}
