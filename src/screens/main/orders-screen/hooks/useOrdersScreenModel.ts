import { useMemo, useState, useCallback } from "react";
import { useLocation } from "@/src/shared/hooks/useLocation";
import { calculateDistance } from "@/src/shared/utils/distance";
import { useOrderByLocation } from "@/src/modules/orders/hooks/useOrders";
import { OrderResponseDto, OrderStatus } from "@/src/modules/orders/types/orders";

export type OrderTabType = "new" | "my" | "overdue";

interface UseOrdersScreenModelParams {
  userId?: string;
}

interface OrdersWithDistance {
  order: OrderResponseDto;
  distance: number | null;
}

const getSearchTarget = (order: OrderResponseDto): string => {
  return [
    order.description ?? "",
    order.address ?? "",
    order.customer?.name ?? "",
    order.customer?.phone ?? "",
    order.id ?? "",
  ]
    .join(" ")
    .toLowerCase();
};

export const useOrdersScreenModel = ({ userId }: UseOrdersScreenModelParams) => {
  const { location, hasPermission } = useLocation();
  const hasLocation = hasPermission && location !== null;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<OrderTabType>("new");
  const [myOrdersStatusFilter, setMyOrdersStatusFilter] = useState<
    OrderStatus | undefined
  >(undefined);

  const { data: newOrdersData, isLoading: isLoadingNew, isFetching: isFetchingNew, refetch: refetchNew, error: newOrdersError } =
    useOrderByLocation(
      {
        status: OrderStatus.PAID,
        currierId: undefined,
      },
      {
        enabled: activeTab === "new",
        pollingIntervalMs: activeTab === "new" ? 2 * 60 * 1000 : false,
      }
    );

  const {
    data: assignedOrdersData,
    isLoading: isLoadingAssigned,
    isFetching: isFetchingAssigned,
    refetch: refetchAssigned,
    error: assignedOrdersError,
  } = useOrderByLocation(
    {
      status: OrderStatus.ASSIGNED,
      currierId: userId,
    },
    {
      enabled: !!userId && activeTab === "my" && myOrdersStatusFilter === undefined,
      pollingIntervalMs:
        !!userId && activeTab === "my" && myOrdersStatusFilter === undefined
          ? 2 * 60 * 1000
          : false,
    }
  );

  const {
    data: inProgressOrdersData,
    isLoading: isLoadingInProgress,
    isFetching: isFetchingInProgress,
    refetch: refetchInProgress,
    error: inProgressOrdersError,
  } = useOrderByLocation(
    {
      status: OrderStatus.IN_PROGRESS,
      currierId: userId,
    },
    {
      enabled: !!userId && activeTab === "my" && myOrdersStatusFilter === undefined,
      pollingIntervalMs:
        !!userId && activeTab === "my" && myOrdersStatusFilter === undefined
          ? 2 * 60 * 1000
          : false,
    }
  );

  const { data: myOrdersData, isLoading: isLoadingMy, isFetching: isFetchingMy, refetch: refetchMy, error: myOrdersError } =
    useOrderByLocation(
      {
        status: myOrdersStatusFilter,
        currierId: userId,
      },
      {
        enabled: !!userId && activeTab === "my" && myOrdersStatusFilter !== undefined,
        pollingIntervalMs:
          !!userId && activeTab === "my" && myOrdersStatusFilter !== undefined
            ? 2 * 60 * 1000
            : false,
      }
    );

  const {
    data: overdueOrdersData,
    isLoading: isLoadingOverdue,
    isFetching: isFetchingOverdue,
    refetch: refetchOverdue,
    error: overdueOrdersError,
  } = useOrderByLocation(
    {
      isOverdue: true,
      currierId: undefined,
    },
    {
      enabled: activeTab === "overdue",
      pollingIntervalMs: activeTab === "overdue" ? 2 * 60 * 1000 : false,
    }
  );

  const ordersWithDistance = useMemo<OrdersWithDistance[]>(() => {
    let baseOrders: OrderResponseDto[] = [];

    if (activeTab === "new") {
      baseOrders = (newOrdersData?.orders || []).filter((order) => !order.isOverdue);
    } else if (activeTab === "overdue") {
      baseOrders = overdueOrdersData?.orders || [];
    } else if (myOrdersStatusFilter === undefined) {
      baseOrders = [
        ...(assignedOrdersData?.orders || []),
        ...(inProgressOrdersData?.orders || []),
      ];
    } else {
      baseOrders = myOrdersData?.orders || [];
    }

    const prepared = baseOrders.map((order) => {
      let distance: number | null = null;
      if (hasLocation && location && order.coordinates) {
        distance = calculateDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: order.coordinates.lat, longitude: order.coordinates.lon }
        );
      }
      return { order, distance };
    });

    return prepared.sort((a, b) => {
      if (a.order.isOverdue && !b.order.isOverdue) return -1;
      if (!a.order.isOverdue && b.order.isOverdue) return 1;

      if (a.order.isOverdue && b.order.isOverdue) {
        const aMinutes = a.order.overdueMinutes || 0;
        const bMinutes = b.order.overdueMinutes || 0;
        if (aMinutes !== bMinutes) return bMinutes - aMinutes;
      }

      if (hasLocation && a.distance !== null && b.distance !== null && a.distance !== b.distance) {
        return a.distance - b.distance;
      }

      return (
        new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime()
      );
    });
  }, [
    activeTab,
    newOrdersData?.orders,
    overdueOrdersData?.orders,
    assignedOrdersData?.orders,
    inProgressOrdersData?.orders,
    myOrdersData?.orders,
    hasLocation,
    location,
    myOrdersStatusFilter,
  ]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return ordersWithDistance.map((item) => item.order);
    const query = searchQuery.toLowerCase();
    return ordersWithDistance
      .filter(({ order }) => getSearchTarget(order).includes(query))
      .map((item) => item.order);
  }, [ordersWithDistance, searchQuery]);

  const distancesByOrderId = useMemo<Record<string, number | null>>(() => {
    return ordersWithDistance.reduce<Record<string, number | null>>((acc, item) => {
      acc[item.order.id] = item.distance;
      return acc;
    }, {});
  }, [ordersWithDistance]);

  const isLoading =
    activeTab === "new"
      ? isLoadingNew
      : activeTab === "overdue"
        ? isLoadingOverdue
        : myOrdersStatusFilter === undefined
          ? isLoadingAssigned || isLoadingInProgress
          : isLoadingMy;

  const isFetching =
    activeTab === "new"
      ? isFetchingNew
      : activeTab === "overdue"
        ? isFetchingOverdue
        : myOrdersStatusFilter === undefined
          ? isFetchingAssigned || isFetchingInProgress
          : isFetchingMy;

  const ordersError =
    activeTab === "new"
      ? newOrdersError
      : activeTab === "overdue"
        ? overdueOrdersError
        : myOrdersStatusFilter === undefined
          ? assignedOrdersError || inProgressOrdersError
          : myOrdersError;

  const tabCounts = useMemo(() => {
    const myCount =
      myOrdersStatusFilter === undefined
        ? (assignedOrdersData?.total || 0) + (inProgressOrdersData?.total || 0)
        : myOrdersData?.total || 0;

    return {
      new: newOrdersData?.orders?.filter((order) => !order.isOverdue).length || 0,
      my: myCount,
      overdue: overdueOrdersData?.total || 0,
    };
  }, [
    myOrdersStatusFilter,
    assignedOrdersData?.total,
    inProgressOrdersData?.total,
    myOrdersData?.total,
    newOrdersData?.orders,
    overdueOrdersData?.total,
  ]);

  const handleRefresh = useCallback(() => {
    if (activeTab === "new") {
      refetchNew();
      return;
    }
    if (activeTab === "overdue") {
      refetchOverdue();
      return;
    }

    if (myOrdersStatusFilter === undefined) {
      refetchAssigned();
      refetchInProgress();
      return;
    }

    refetchMy();
  }, [
    activeTab,
    myOrdersStatusFilter,
    refetchNew,
    refetchOverdue,
    refetchAssigned,
    refetchInProgress,
    refetchMy,
  ]);

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    myOrdersStatusFilter,
    setMyOrdersStatusFilter,
    filteredOrders,
    distancesByOrderId,
    isLoading,
    isFetching,
    ordersError,
    tabCounts,
    handleRefresh,
  };
};
