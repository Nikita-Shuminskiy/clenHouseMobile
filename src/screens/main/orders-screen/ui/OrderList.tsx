import React from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import { OrderResponseDto } from '@/src/modules/orders/types/orders';
import OrderCard from './OrderCard';
import EmptyOrders from './EmptyOrders';

interface OrderListProps {
  orders: OrderResponseDto[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onOrderPress?: (order: OrderResponseDto) => void;
  onOrderAction?: (order: OrderResponseDto, action: string) => void;
  onLoadMore?: () => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onOrderPress,
  onOrderAction,
  onLoadMore,
}) => {
  const renderOrder = ({ item }: { item: OrderResponseDto }) => (
    <OrderCard
      order={item}
      onPress={onOrderPress}
      onAction={onOrderAction}
    />
  );

  const renderEmpty = () => (
    <EmptyOrders />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <View style={styles.footer} />;
  };

  return (
    <FlatList
      data={orders}
      renderItem={renderOrder}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#1A1A1A']}
            tintColor="#1A1A1A"
          />
        ) : undefined
      }
      ListEmptyComponent={!isLoading ? renderEmpty : null}
      ListFooterComponent={renderFooter}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  footer: {
    height: 20,
  },
});

export default OrderList;
