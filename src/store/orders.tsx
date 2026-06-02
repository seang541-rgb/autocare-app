import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { orders as seedOrders, Order } from '@/constants/data';

export type LiveOrder = Order & {
  qrCode: string;
  createdAt: number;
};

type OrderStore = {
  list: LiveOrder[];
  addOrder: (o: Omit<Order, 'id' | 'status'>) => LiveOrder;
  redeem: (id: string) => void;
  reschedule: (id: string, date: string, time: string) => void;
  addReview: (id: string, rating: number, review: string) => void;
  addComplaint: (id: string, complaint: string) => void;
  getById: (id: string) => LiveOrder | undefined;
};

const Ctx = createContext<OrderStore | null>(null);

function withQr(o: Order): LiveOrder {
  return { ...o, qrCode: `AUTOCARE|${o.id}|${o.price}`, createdAt: Date.now() };
}

let counter = 2400;

export function OrderProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<LiveOrder[]>(() => seedOrders.map(withQr));

  const store = useMemo<OrderStore>(
    () => ({
      list,
      addOrder: (o) => {
        counter += 1;
        const full: LiveOrder = withQr({ ...o, id: `#A${counter}`, status: 'upcoming' });
        setList((prev) => [full, ...prev]);
        return full;
      },
      redeem: (id) =>
        setList((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'done' } : x))),
      reschedule: (id, date, time) =>
        setList((prev) => prev.map((x) => (x.id === id ? { ...x, date, time } : x))),
      addReview: (id, rating, review) =>
        setList((prev) => prev.map((x) => (x.id === id ? { ...x, rating, review } : x))),
      addComplaint: (id, complaint) =>
        setList((prev) => prev.map((x) => (x.id === id ? { ...x, complaint } : x))),
      getById: (id) => list.find((x) => x.id === id),
    }),
    [list],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useOrders() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOrders must be used within OrderProvider');
  return c;
}
