// src/hooks/useOrder.ts
import { useContext } from 'react';
import { OrderContext, OrderContextType } from '../providers/OrderResProvider';

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const useCompletedOrders = (): any[] => {
  const { completedOrders } = useOrder();
  return completedOrders;
};

export const useOrderNotifications = (): { 
  showTooltip: boolean; 
  dismissTooltip: () => void;
  clearDismissedOrders: () => void;
  markOrdersAsProcessed: (orderIds: number[]) => void;
} => {
  const { showTooltip, dismissTooltip, clearDismissedOrders, markOrdersAsProcessed } = useOrder();
  return { showTooltip, dismissTooltip, clearDismissedOrders, markOrdersAsProcessed };
};