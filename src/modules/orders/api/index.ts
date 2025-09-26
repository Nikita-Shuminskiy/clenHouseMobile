import { instance } from "@/src/shared/api/configs/config";
import {
  CreateOrderDto,
  OrderResponseDto,
  OrdersListResponse,
  UpdateOrderStatusDto,
  TakeOrderDto,
  StartOrderDto,
  CompleteOrderDto,
  CancelOrderDto,
  OrderStatus,
} from "../types/orders";
import { AxiosResponse } from "axios";

export const ordersApi = {
  create: (data: CreateOrderDto) =>
    instance
      .post<CreateOrderDto, AxiosResponse<OrderResponseDto>>("/orders", data)
      .then((res) => res.data),

  findAll: (params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    customerId?: string;
    currierId?: string;
  }) =>
    instance
      .get<OrdersListResponse>("/orders", { params })
      .then((res) => res.data),

  findOne: (id: string) =>
    instance
      .get<OrderResponseDto>(`/orders/${id}`)
      .then((res) => res.data),

  updateStatus: (id: string, data: UpdateOrderStatusDto) =>
    instance
      .patch<UpdateOrderStatusDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/status`,
        data
      )
      .then((res) => res.data),

  remove: (id: string) =>
    instance.delete(`/orders/${id}`).then(() => undefined),

  // ==================== COURIER OPERATIONS ====================

  takeOrder: (id: string, data: TakeOrderDto) =>
    instance
      .patch<TakeOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/take`,
        data
      )
      .then((res) => res.data),

  startOrder: (id: string, data: StartOrderDto) =>
    instance
      .patch<StartOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/start`,
        data
      )
      .then((res) => res.data),

  completeOrder: (id: string, data: CompleteOrderDto) =>
    instance
      .patch<CompleteOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/complete`,
        data
      )
      .then((res) => res.data),

  cancel: (id: string, data: CancelOrderDto) =>
    instance
      .patch<CancelOrderDto, AxiosResponse<OrderResponseDto>>(
        `/orders/${id}/cancel`,
        data
      )
      .then((res) => res.data),

};
