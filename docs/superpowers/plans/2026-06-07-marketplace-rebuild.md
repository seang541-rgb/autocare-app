# Marketplace Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the app from a car-care booking product into a customer + merchant marketplace demo.

**Architecture:** Replace the domain layer with marketplace entities, then update customer-facing tabs and merchant-facing order management to consume that model. Keep Expo Router, React Native, local state providers, and the existing UI primitives.

**Tech Stack:** Expo Router, React Native, TypeScript, AsyncStorage, Ionicons, expo-linear-gradient.

---

### Task 1: Marketplace Domain Data

**Files:**
- Modify: `src/constants/brand.ts`
- Replace: `src/constants/data.ts`
- Modify: `src/store/orders.tsx`

- [ ] **Step 1: Rename the app brand**

Change `AppBrand.name` to `LokalGo` and tagline to `Local merchants, one tap away`.

- [ ] **Step 2: Replace car-care data with marketplace entities**

Create category, merchant, catalog item, promo, notification, profile, and seed order data in `src/constants/data.ts`. The model must include car care, food, retail, and services.

- [ ] **Step 3: Generalize order storage**

Update `src/store/orders.tsx` so `addOrder` accepts merchant orders with line items and totals, and status changes can move through `new`, `accepted`, `preparing`, `ready`, `completed`, and `cancelled`.

- [ ] **Step 4: Run TypeScript**

Run: `npm.cmd exec tsc -- --noEmit`
Expected: existing page errors reveal the next UI files to update.

### Task 2: Customer Marketplace UI

**Files:**
- Replace: `src/app/(tabs)/index.tsx`
- Replace: `src/app/(tabs)/booking.tsx`
- Create: `src/app/merchant/[id].tsx`
- Replace: `src/app/confirm.tsx`
- Modify: `src/app/success.tsx`

- [ ] **Step 1: Rebuild Home**

Home shows location, search, categories, featured merchants, nearby merchants, and notification modal.

- [ ] **Step 2: Rebuild Explore tab**

The old booking tab becomes a merchant/category browser.

- [ ] **Step 3: Add merchant detail**

Merchant detail shows merchant status, catalog items, quantity controls, cart summary, and checkout action.

- [ ] **Step 4: Rebuild checkout**

Checkout accepts merchant id, selected line items, fulfilment mode, note, calculates subtotal/discount/total, then creates an order.

- [ ] **Step 5: Update success page**

Success page describes merchant order confirmation and links to orders.

### Task 3: Orders and Merchant Console

**Files:**
- Replace: `src/app/(tabs)/orders.tsx`
- Replace: `src/app/(tabs)/staff.tsx`
- Modify: `src/app/order/[id].tsx`

- [ ] **Step 1: Rebuild customer orders**

Orders list must support food, car care, retail, and service orders with status labels.

- [ ] **Step 2: Rebuild merchant console**

Staff tab becomes merchant console with open status, queue metrics, order status buttons, and QR completion.

- [ ] **Step 3: Update order detail**

Order detail shows merchant, lines, total, fulfilment, QR, review, and complaint actions.

### Task 4: Navigation, Language, and Verification

**Files:**
- Modify: `src/app/(tabs)/_layout.tsx`
- Modify: `src/store/i18n.tsx`
- Modify: `app.json`

- [ ] **Step 1: Rename tabs**

Tabs become Home, Explore, Orders, Merchant, Me.

- [ ] **Step 2: Update visible copy**

Adjust English, Chinese, and Malay labels for marketplace language.

- [ ] **Step 3: Update Expo app identity**

Use `LokalGo` name and scheme/package if safe for this branch.

- [ ] **Step 4: Verify**

Run:

```powershell
npm.cmd exec tsc -- --noEmit
npm.cmd run lint
npx.cmd expo export --platform web --output-dir .tmp-marketplace-export
```

Expected: all commands complete successfully.
