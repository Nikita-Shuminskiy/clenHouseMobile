import { OrderResponseDto } from '@/src/modules/orders/types/orders';
import { formatDateHeader } from './formatting';

export interface OrderSection {
  title: string;
  date: string; // ISO строка даты для сортировки
  data: OrderResponseDto[];
}

export type FlatListItem = 
  | { type: 'header'; title: string; id: string; date: string }
  | { type: 'order'; order: OrderResponseDto };

/**
 * Группирует заказы по датам создания с отдельной группой для просроченных
 * @param orders - массив заказов
 * @returns массив секций с заголовками дат (просроченные вверху)
 */
export const groupOrdersByDate = (orders: OrderResponseDto[]): OrderSection[] => {
  if (!orders || orders.length === 0) {
    return [];
  }

  // Разделяем просроченные и обычные заказы
  const overdueOrders: OrderResponseDto[] = [];
  const normalOrders: OrderResponseDto[] = [];

  orders.forEach((order) => {
    if (order.isOverdue) {
      overdueOrders.push(order);
    } else {
      normalOrders.push(order);
    }
  });

  const sections: OrderSection[] = [];

  // Добавляем группу просроченных вверху, если есть
  if (overdueOrders.length > 0) {
    sections.push({
      title: 'Просроченные',
      date: 'overdue',
      data: overdueOrders.sort((a, b) => {
        // Сортируем по времени просрочки (больше просрочки = выше)
        const aMinutes = a.overdueMinutes || 0;
        const bMinutes = b.overdueMinutes || 0;
        if (aMinutes !== bMinutes) return bMinutes - aMinutes;
        // Затем по времени создания
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }),
    });
  }

  // Группируем обычные заказы по дате
  const groupedMap = new Map<string, OrderResponseDto[]>();

  normalOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const dateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
    
    if (!groupedMap.has(dateKey)) {
      groupedMap.set(dateKey, []);
    }
    groupedMap.get(dateKey)!.push(order);
  });

  // Преобразуем Map в массив секций
  const dateSections: OrderSection[] = Array.from(groupedMap.entries())
    .map(([dateKey, ordersInGroup]) => {
      const firstOrderDate = ordersInGroup[0].createdAt;
      return {
        title: formatDateHeader(firstOrderDate),
        date: dateKey,
        data: ordersInGroup.sort((a, b) => {
          // Сортируем по времени создания (новые сверху)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
      };
    })
    .sort((a, b) => {
      // Сортируем секции по дате (новые сверху)
      return b.date.localeCompare(a.date);
    });

  sections.push(...dateSections);

  return sections;
};

/**
 * Преобразует секции заказов в плоский массив для FlatList
 * @param sections - массив секций с заказами
 * @param expandedSections - Set с ID открытых секций
 * @returns плоский массив с заголовками и заказами
 */
export const flattenOrdersWithHeaders = (
  sections: OrderSection[], 
  expandedSections: Set<string> = new Set()
): FlatListItem[] => {
  const flatList: FlatListItem[] = [];
  
  sections.forEach((section) => {
    const sectionId = section.date;
    const isExpanded = expandedSections.has(sectionId);
    
    // Добавляем заголовок даты
    flatList.push({
      type: 'header',
      title: section.title,
      id: `header-${section.date}`,
      date: section.date,
    });
    
    // Добавляем заказы из этой секции только если секция открыта
    if (isExpanded) {
      section.data.forEach((order) => {
        flatList.push({
          type: 'order',
          order,
        });
      });
    }
  });
  
  return flatList;
};

