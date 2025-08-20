import React, { createContext, useEffect, useState } from 'react';

// Define the context type
export interface OrderContextType {
  completedOrders: any[];
  showTooltip: boolean;
  dismissTooltip: () => void;
  checkCompletedOrders: () => Promise<void>;
  clearDismissedOrders: () => void;
  markOrdersAsProcessed: (orderIds: number[]) => void;
}

// Create Order Context with default value
export const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Order Provider Component
export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissedOrderIds, setDismissedOrderIds] = useState<Set<number>>(new Set());
  const [processedOrderIds, setProcessedOrderIds] = useState<Set<number>>(new Set());

  // Function to check for completed orders
  const checkCompletedOrders = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('YOUR_API_ENDPOINT/completed-orders');
      const data = await response.json();
      
      if (data.length > 0) {
        // Filter out orders that have been dismissed or processed
        const newOrders = data.filter((order: any) => 
          !dismissedOrderIds.has(order.id) && !processedOrderIds.has(order.id)
        );
        
        if (newOrders.length > 0) {
          setCompletedOrders(newOrders);
          setShowTooltip(true);
        }
      }
    } catch (error) {
      console.log('API call failed, using mock data for testing');
      
      // For testing purposes - use consistent mock data
      // Use fixed IDs so they can be properly tracked
      const mockOrders: any[] = [
        { id: 1, orderNumber: "ORD001", customerName: "John Doe" },
        { id: 2, orderNumber: "ORD002", customerName: "Jane Smith" },
        { id: 3, orderNumber: "ORD003", customerName: "Bob Johnson" }
      ];
      
      // Filter out orders that have been dismissed or processed
      const newOrders = mockOrders.filter(order => 
        !dismissedOrderIds.has(order.id) && !processedOrderIds.has(order.id)
      );
      
      if (newOrders.length > 0) {
        setCompletedOrders(newOrders);
        setShowTooltip(true);
      }
    }
  };

  // Function to dismiss tooltip (only for close button - temporary dismiss)
  const dismissTooltip = () => {
    // Add current order IDs to dismissed set (temporary)
    const currentOrderIds = completedOrders.map(order => order.id);
    setDismissedOrderIds(prev => new Set([...prev, ...currentOrderIds]));
    
    setShowTooltip(false);
  };

  // Function to clear dismissed orders (optional - for resetting state)
  const clearDismissedOrders = () => {
    setDismissedOrderIds(new Set());
  };

  // Function to mark specific orders as assigned/processed (permanent)
  const markOrdersAsProcessed = (orderIds: number[]) => {
    // Mark as processed permanently
    setProcessedOrderIds(prev => new Set([...prev, ...orderIds]));
    
    // Also remove from dismissed (since they're now processed)
    setDismissedOrderIds(prev => {
      const newSet = new Set(prev);
      orderIds.forEach(id => newSet.delete(id));
      return newSet;
    });
    
    setShowTooltip(false);
  };

  // Auto-check for completed orders
  useEffect(() => {
    checkCompletedOrders();
    const interval = setInterval(checkCompletedOrders, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissedOrderIds, processedOrderIds]);
  

  return (
    <OrderContext.Provider value={{
      completedOrders,
      showTooltip,
      dismissTooltip,
      checkCompletedOrders,
      clearDismissedOrders,
      markOrdersAsProcessed
    }}>
      {children}
    </OrderContext.Provider>
  );
};