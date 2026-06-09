# Profile Core Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Profile page menu from demo to usable local features for vehicles, coupons, payment methods, and addresses.

**Architecture:** Add a focused local account store for editable profile-side data, then add one route per feature. Keep all data in React state for this phase so the app can be tested without backend or payment credentials.

**Tech Stack:** Expo Router, React Native, TypeScript, local React context, existing `Card`, `BackHeader`, `GradIcon`, `Brand`, and `useI18n` patterns.

---

### Task 1: Local Account Store

**Files:**
- Create: `src/store/account.tsx`
- Modify: `src/app/_layout.tsx`

- [ ] **Step 1: Create account types and seed data**

Create `vehicles`, `coupons`, `payments`, and `addresses` arrays with stable ids and a single default item where appropriate.

- [ ] **Step 2: Add mutations**

Expose `addVehicle`, `setDefaultVehicle`, `addPayment`, `setDefaultPayment`, `addAddress`, `updateAddress`, `deleteAddress`, and `setDefaultAddress`.

- [ ] **Step 3: Wrap app with provider**

Add `AccountProvider` inside the existing root providers.

### Task 2: Wire Profile Entry Points

**Files:**
- Modify: `src/app/(tabs)/profile.tsx`
- Modify: `src/store/i18n.tsx`

- [ ] **Step 1: Replace demo toasts with navigation**

Route `myVehicles`, `coupons`, `paymentMethods`, and `addressBook` to dedicated pages.

- [ ] **Step 2: Use live account counts**

Show default plate, coupon count, default payment, and default address summary from `useAccount()`.

### Task 3: Vehicles Page

**Files:**
- Create: `src/app/profile/vehicles.tsx`

- [ ] **Step 1: List vehicles**

Show plate, model, year, default badge, and default selector.

- [ ] **Step 2: Add vehicle form**

Use local inputs for plate, model, and year; validate non-empty plate and model before adding.

### Task 4: Coupons Page

**Files:**
- Create: `src/app/profile/coupons.tsx`

- [ ] **Step 1: Add coupon tabs**

Provide usable, used, and expired filters.

- [ ] **Step 2: Show coupon rules**

Each coupon card displays title, discount, expiry, and rule text.

### Task 5: Payment Methods Page

**Files:**
- Create: `src/app/profile/payments.tsx`

- [ ] **Step 1: List methods**

Show TnG, FPX, and card placeholders with default selector.

- [ ] **Step 2: Add local method**

Allow adding another placeholder payment method for local testing.

### Task 6: Addresses Page

**Files:**
- Create: `src/app/profile/addresses.tsx`

- [ ] **Step 1: List addresses**

Show label, full address, default badge, set default, and delete controls.

- [ ] **Step 2: Add address form**

Add label and address fields with simple validation.

### Verification

- [ ] Run `npm.cmd exec tsc -- --noEmit`
- [ ] Run `npm.cmd run lint`
- [ ] Run a local app preview if needed for UI inspection
