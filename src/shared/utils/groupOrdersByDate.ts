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
 * Группирует заказы по датам создания
 * @param orders - массив заказов
 * @returns массив секций с заголовками дат
 */
export const groupOrdersByDate = (orders: OrderResponseDto[]): OrderSection[] => {
  if (!orders || orders.length === 0) {
    return [];
  }

  // Группируем заказы по дате (без учета времени)
  const groupedMap = new Map<string, OrderResponseDto[]>();

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    // Создаем ключ в формате YYYY-MM-DD для группировки
    const dateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;
    
    if (!groupedMap.has(dateKey)) {
      groupedMap.set(dateKey, []);
    }
    groupedMap.get(dateKey)!.push(order);
  });

  // Преобразуем Map в массив секций
  const sections: OrderSection[] = Array.from(groupedMap.entries())
    .map(([dateKey, ordersInGroup]) => {
      // Используем дату первого заказа для форматирования заголовка
      const firstOrderDate = ordersInGroup[0].createdAt;
      return {
        title: formatDateHeader(firstOrderDate),
        date: dateKey,
        data: ordersInGroup.sort((a, b) => {
          // 1. Просроченные заказы всегда вверху
          if (a.isOverdue && !b.isOverdue) return -1;
          if (!a.isOverdue && b.isOverdue) return 1;
          
          // 2. Внутри каждой группы сортируем по времени создания (новые сверху)
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }),
      };
    })
    .sort((a, b) => {
      // Сортируем секции по дате (новые сверху)
      return b.date.localeCompare(a.date);
    });

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

