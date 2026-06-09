import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { merchants, orders as seedOrders, Order, OrderLine, MarketplaceStatus } from '@/constants/data';

export type LiveOrder = Order & {
  qrCode: string;
  createdAt: number;
};

type CreateOrderInput = {
  merchantId: string;
  type?: Order['type'];
  lines: OrderLine[];
  date?: string;
  time?: string;
  note?: string;
  discount?: number;
};

type LegacyOrderInput = Omit<Order, 'id' | 'status' | 'merchantId' | 'merchantName' | 'categoryId' | 'type' | 'lines' | 'subtotal' | 'discount' | 'total' | 'qrCode'>;

type OrderStore = {
  list: LiveOrder[];
  addOrder: (o: CreateOrderInput | LegacyOrderInput) => LiveOrder;
  updateStatus: (id: string, status: MarketplaceStatus) => void;
  redeem: (id: string) => void;
  reschedule: (id: string, date: string, time: string) => void;
  addReview: (id: string, rating: number, review: string) => void;
  addComplaint: (id: string, complaint: string) => void;
  getById: (id: string) => LiveOrder | undefined;
};

const Ctx = createContext<OrderStore | null>(null);

function withQr(o: Order): LiveOrder {
  return { ...o, qrCode: o.qrCode ?? `LOKALGO|${o.id}|${o.total}`, createdAt: Date.now() };
}

let counter = 2500;

function isMarketplaceInput(o: CreateOrderInput | LegacyOrderInput): o is CreateOrderInput {
  return 'merchantId' in o && 'lines' in o;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<LiveOrder[]>(() => seedOrders.map(withQr));

  const store = useMemo<OrderStore>(
    () => ({
      list,
      addOrder: (input) => {
        counter += 1;
        const id = `#LG${counter}`;
        let full: Order;

        if (isMarketplaceInput(input)) {
          const merchant = merchants.find((m) => m.id === input.merchantId) ?? merchants[0];
          const subtotal = input.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
          const discount = input.discount ?? (subtotal >= 20 ? 2 : 0);
          const total = Math.max(0, subtotal - discount);
          const firstLine = input.lines[0];
          full = {
            id,
            merchantId: merchant.id,
            merchantName: merchant.name,
            categoryId: merchant.categoryId,
            type: input.type ?? merchant.fulfilment[0] ?? 'pickup',
            status: 'new',
            lines: input.lines,
            subtotal,
            discount,
            total,
            date: input.date ?? '2026-06-07',
            time: input.time ?? 'ASAP',
            note: input.note,
            qrCode: `LOKALGO|${id}|${total}`,
            service: firstLine ? firstLine.name : merchant.hero,
            icon: merchant.icon,
            grad: merchant.grad,
            outletId: merchant.id,
            outlet: merchant.name,
            price: total,
          };
        } else {
          const merchant = merchants.find((m) => m.id === input.outletId) ?? merchants[0];
          const price = input.price ?? 0;
          full = {
            ...input,
            id,
            merchantId: merchant.id,
            merchantName: input.outlet || merchant.name,
            categoryId: merchant.categoryId,
            type: 'booking',
            status: 'new',
            lines: [{ itemId: 'legacy', name: input.service, qty: 1, price }],
            subtotal: price,
            discount: 0,
            total: price,
            qrCode: `LOKALGO|${id}|${price}`,
          };
        }

        const live = withQr(full);
        setList((prev) => [live, ...prev]);
        return live;
      },
      updateStatus: (id, status) => setList((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x))),
      redeem: (id) => setList((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'completed' } : x))),
      reschedule: (id, date, time) => setList((prev) => prev.map((x) => (x.id === id ? { ...x, date, time } : x))),
      addReview: (id, rating, review) => setList((prev) => prev.map((x) => (x.id === id ? { ...x, rating, review } : x))),
      addComplaint: (id, complaint) => setList((prev) => prev.map((x) => (x.id === id ? { ...x, complaint } : x))),
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
