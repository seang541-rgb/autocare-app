# LokalGo Merchant Pin Icon System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace cheap-looking random gradient icon blocks with the approved A?? Merchant Pin logo and a unified LokalGo line icon system.

**Architecture:** Add one focused `brand-icons.tsx` component file using `react-native-svg`, then route existing icon surfaces through it. Keep the current app flows and data unchanged.

**Tech Stack:** Expo React Native, `react-native-svg`, existing Brand tokens and Expo Router.

---

### Task 1: Add Brand Icon Components

**Files:**
- Create: `src/components/brand-icons.tsx`

- [ ] Create `BrandMark`, `BrandGlyph`, and `BrandIcon` components. `BrandMark` draws the Merchant Pin. `BrandGlyph` maps existing Ionicon names to custom LokalGo line symbols. `BrandIcon` wraps a glyph in a restrained white/soft surface.

### Task 2: Route Existing GradIcon Through Brand System

**Files:**
- Modify: `src/components/ui.tsx`

- [ ] Update `GradIcon` so known app icons render with `BrandIcon`, while unknown icons keep Ionicons fallback. This upgrades profile menus, order cards, merchant cards, and other existing surfaces without changing every call site.

### Task 3: Replace Top-Level Brand Marks

**Files:**
- Modify: `src/app/(tabs)/index.tsx`
- Modify: `src/app/(tabs)/staff.tsx`

- [ ] Replace storefront logo blocks with `BrandMark`.
- [ ] Replace category grid gradient blocks with `GradIcon`/brand glyphs.

### Task 4: Verify

**Commands:**
- `npm.cmd exec tsc -- --noEmit`
- `npx.cmd expo lint -- --no-cache`
- `npx.cmd expo export --platform web --output-dir .tmp-icon-system-check`

---
