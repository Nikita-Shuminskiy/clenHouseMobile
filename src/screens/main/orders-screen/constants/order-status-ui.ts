import { OrderStatus } from "@/src/modules/orders/types/orders";
import { HARVEST_COLORS } from "@/src/shared/harvest-theme";

interface OrderStatusUi {
  label: string;
  color: string;
}

const ORDER_STATUS_UI: Record<OrderStatus, OrderStatusUi> = {
  [OrderStatus.NEW]: {
    label: "Новый",
    color: HARVEST_COLORS.flame,
  },
  [OrderStatus.PAID]: {
    label: "Оплачен",
    color: HARVEST_COLORS.flame,
  },
  [OrderStatus.ASSIGNED]: {
    label: "Назначен",
    color: HARVEST_COLORS.flamePressed,
  },
  [OrderStatus.IN_PROGRESS]: {
    label: "В работе",
    color: HARVEST_COLORS.flamePressed,
  },
  [OrderStatus.DONE]: {
    label: "Завершен",
    color: HARVEST_COLORS.stone,
  },
  [OrderStatus.CANCELED]: {
    label: "Отменен",
    color: HARVEST_COLORS.danger,
  },
};

export const getOrderStatusUi = (status: OrderStatus): OrderStatusUi => {
  return (
    ORDER_STATUS_UI[status] ?? {
      label: "Неизвестно",
      color: HARVEST_COLORS.stone,
    }
  );
};
