import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { orders as seedOrders, Order } from '@/constants/data';

export type LiveOrder = Order & {
  qrCode: string;     // 二维码内容（订单号+校验）
  createdAt: number;
};

type OrderStore = {
  list: LiveOrder[];
  addOrder: (o: Omit<Order, 'id' | 'status'>) => LiveOrder;
  redeem: (id: string) => void;          // 核销（待到店 → 已完成）
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
