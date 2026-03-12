import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useCancelOrder, useTakeOrder, useUpdateOrderStatus } from "@/src/modules/orders/hooks/useOrders";
import { OrderResponseDto, OrderStatus } from "@/src/modules/orders/types/orders";

interface UseOrderActionsParams {
  userId?: string;
}

export const useOrderActions = ({ userId }: UseOrderActionsParams) => {
  const updateStatusMutation = useUpdateOrderStatus();
  const takeOrderMutation = useTakeOrder();
  const cancelOrderMutation = useCancelOrder();

  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponseDto | null>(null);

  const handleOrderAction = useCallback(
    (order: OrderResponseDto, action: string) => {
      switch (action) {
        case "accept":
          if (!userId) {
            Alert.alert("Ошибка", "Не удалось определить пользователя");
            return;
          }
          takeOrderMutation.mutate({
            id: order.id,
            data: { courierId: userId },
          });
          return;
        case "start":
          setSelectedOrder(order);
          setStartModalVisible(true);
          return;
        case "complete":
          setSelectedOrder(order);
          setCompleteModalVisible(true);
          return;
        case "cancel":
          Alert.alert("Отменить заказ", "Вы уверены, что хотите отменить этот заказ?", [
            { text: "Нет", style: "cancel" },
            {
              text: "Да",
              style: "destructive",
              onPress: () => {
                cancelOrderMutation.mutate({
                  id: order.id,
                  cancelOrderDto: {
                    courierId: userId || "",
                    reason: "Отменен пользователем",
                  },
                });
              },
            },
          ]);
      }
    },
    [cancelOrderMutation, takeOrderMutation, userId]
  );

  const handleConfirmComplete = useCallback(() => {
    if (!selectedOrder) return;

    updateStatusMutation.mutate(
      {
        id: selectedOrder.id,
        data: {
          status: OrderStatus.DONE,
          currierId: userId,
        },
      },
      {
        onSuccess: () => {
          setCompleteModalVisible(false);
          setSelectedOrder(null);
        },
      }
    );
  }, [selectedOrder, updateStatusMutation, userId]);

  const handleConfirmStart = useCallback(() => {
    if (!selectedOrder) return;

    updateStatusMutation.mutate(
      {
        id: selectedOrder.id,
        data: {
          status: OrderStatus.IN_PROGRESS,
          currierId: userId,
        },
      },
      {
        onSuccess: () => {
          setStartModalVisible(false);
          setSelectedOrder(null);
        },
      }
    );
  }, [selectedOrder, updateStatusMutation, userId]);

  const handleCloseCompleteModal = useCallback(() => {
    setCompleteModalVisible(false);
    setSelectedOrder(null);
  }, []);

  const handleCloseStartModal = useCallback(() => {
    setStartModalVisible(false);
    setSelectedOrder(null);
  }, []);

  return {
    handleOrderAction,
    completeModalVisible,
    startModalVisible,
    handleConfirmComplete,
    handleConfirmStart,
    handleCloseCompleteModal,
    handleCloseStartModal,
  };
};
