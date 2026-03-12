import { OrderStatus } from "@/src/modules/orders/types/orders";

interface OrderStatusUi {
  label: string;
  color: string;
}

const ORDER_STATUS_UI: Record<OrderStatus, OrderStatusUi> = {
  [OrderStatus.NEW]: {
    label: "Новый",
    color: "#4CAF50",
  },
  [OrderStatus.PAID]: {
    label: "Оплачен",
    color: "#2196F3",
  },
  [OrderStatus.ASSIGNED]: {
    label: "Назначен",
    color: "#FF9800",
  },
  [OrderStatus.IN_PROGRESS]: {
    label: "В работе",
    color: "#FFC107",
  },
  [OrderStatus.DONE]: {
    label: "Завершен",
    color: "#9E9E9E",
  },
  [OrderStatus.CANCELED]: {
    label: "Отменен",
    color: "#F44336",
  },
};

export const getOrderStatusUi = (status: OrderStatus): OrderStatusUi => {
  return (
    ORDER_STATUS_UI[status] ?? {
      label: "Неизвестно",
      color: "#9E9E9E",
    }
  );
};
