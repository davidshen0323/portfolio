import { useState } from 'react';
import { transitionOrder } from '../domain/orderWorkflow';
import { useStoredState } from '../../../shared/hooks/useStoredState';
import initialOrders from '../data/orders.json';
import initialBookings from '../data/bookings.json';
import initialStock from '../../commerce/data/stock.json';
import { ORDER_KEY, STOCK_KEY } from '../../commerce/services/orderRepository';

const sampleTickets = [
  {
    id: 'TK-1001',
    subject: '商品保養方式詢問',
    order: 'AX-2401',
    priority: '一般',
    note: '先整理皮革用品的保養說明，再回覆使用方式。',
    status: '待處理',
    created: '2026-09-24T10:00:00Z',
  },
  {
    id: 'TK-1002',
    subject: '配送進度確認',
    order: 'AX-2402',
    priority: '優先',
    note: '核對訂單的處理進度。此紀錄為自主設定的情境。',
    status: '處理中',
    created: '2026-09-23T10:00:00Z',
  },
];

export function useOperations() {
  const [workflowError, setWorkflowError] = useState('');
  const [admin, setAdmin, adminError] = useStoredState('forma-admin-orders', initialOrders);
  const [shop, setShop, shopError] = useStoredState(ORDER_KEY, []);
  const [bookings, setBookings, bookingError] = useStoredState(
    'forma-demo-bookings',
    initialBookings,
  );
  const [stock, setStock, stockError] = useStoredState(STOCK_KEY, initialStock);
  const [tickets, setTickets, ticketError] = useStoredState('forma-support-tickets', sampleTickets);
  const ids = new Set(shop.map((order) => order.id));
  const orders = [...shop, ...admin.filter((order) => !ids.has(order.id))];
  const updateOrder = (id, status) => {
    const save = ids.has(id) ? setShop : setAdmin;
    try {
      const ok = save((rows) =>
        rows.map((row) =>
          row.id === id ? transitionOrder(row, status, new Date().toISOString()) : row,
        ),
      );
      setWorkflowError('');
      return ok;
    } catch (error) {
      setWorkflowError(error.message);
      return false;
    }
  };
  return {
    orders,
    updateOrder,
    bookings,
    setBookings,
    stock,
    setStock,
    tickets,
    setTickets,
    resetBookings: () => setBookings(initialBookings),
    resetStock: () => setStock(initialStock),
    error: workflowError || adminError || shopError || bookingError || stockError || ticketError,
  };
}
