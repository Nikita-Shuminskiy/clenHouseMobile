import React, { useMemo, useState, useCallback } from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import { OrderResponseDto } from '@/src/modules/orders/types/orders';
import { groupOrdersByDate, flattenOrdersWithHeaders, FlatListItem } from '@/src/shared/utils/groupOrdersByDate';
import OrderCard from './OrderCard';
import EmptyOrders from './EmptyOrders';
import DateHeader from './DateHeader';

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
  // Состояние для отслеживания открытых/закрытых секций
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    // По умолчанию все секции открыты
    const sections = groupOrdersByDate(orders);
    return new Set(sections.map(s => s.date));
  });

  // Группируем заказы по датам
  const sections = useMemo(() => {
    return groupOrdersByDate(orders);
  }, [orders]);

  // Обновляем expandedSections при изменении orders
  React.useEffect(() => {
    const newSections = new Set(sections.map(s => s.date));
    setExpandedSections(prev => {
      const updated = new Set(prev);
      // Добавляем новые секции как открытые
      newSections.forEach(date => {
        if (!updated.has(date)) {
          updated.add(date);
        }
      });
      // Удаляем секции, которых больше нет
      Array.from(updated).forEach(date => {
        if (!newSections.has(date)) {
          updated.delete(date);
        }
      });
      return updated;
    });
  }, [sections]);

  // Преобразуем в плоский массив с учетом открытых/закрытых секций
  const flatListData = useMemo(() => {
    return flattenOrdersWithHeaders(sections, expandedSections);
  }, [sections, expandedSections]);

  // Обработчик переключения секции
  const handleToggleSection = useCallback((date: string) => {
    setExpandedSections(prev => {
      const updated = new Set(prev);
      if (updated.has(date)) {
        updated.delete(date);
      } else {
        updated.add(date);
      }
      return updated;
    });
  }, []);

  const renderItem = ({ item }: { item: FlatListItem }) => {
    if (item.type === 'header') {
      const isExpanded = expandedSections.has(item.date);
      return (
        <DateHeader 
          title={item.title} 
          isExpanded={isExpanded}
          onPress={() => handleToggleSection(item.date)}
        />
      );
    }
    
    return (
      <OrderCard
        order={item.order}
        onPress={onOrderPress}
        onAction={onOrderAction}
      />
    );
  };

  const renderEmpty = () => (
    <EmptyOrders />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <View style={styles.footer} />;
  };

  const keyExtractor = (item: FlatListItem) => {
    if (item.type === 'header') {
      return item.id;
    }
    return item.order.id;
  };

  return (
    <FlatList
      data={flatListData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
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
    paddingTop: 8,
    paddingBottom: 16,
    flexGrow: 1,
  },
  footer: {
    height: 20,
  },
});

export default OrderList;
