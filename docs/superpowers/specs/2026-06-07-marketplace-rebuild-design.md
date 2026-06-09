# Marketplace Rebuild Design

## Goal

Rebuild the current car-care app into a Grab-style marketplace for Malaysia where customers can browse car wash, restaurants, and local merchants, while merchants can manage incoming orders from the same app.

## Scope

The first version will not include rider delivery, real payment settlement, or a web admin dashboard. It will focus on a working mobile demo with customer ordering and a simple merchant console.

## Product Shape

The app becomes a two-role marketplace:

- Customer role: browse categories, find merchants, view menu or services, add items, checkout, and track orders.
- Merchant role: view today's orders, accept orders, update preparation/service status, mark orders complete, and handle QR redemption for service bookings.

## Information Architecture

- Home: location, category shortcuts, featured merchants, nearby merchants, promos, notification entry.
- Explore: merchant/category browsing with filters for car care, food, retail, and services.
- Merchant detail: merchant profile, open status, rating, preparation/wait time, catalog items, cart summary.
- Checkout: order summary, fulfilment type, customer note, payment method placeholder, automatic total calculation.
- Orders: unified order history across booking, pickup, and merchant service orders.
- Merchant: simple merchant console with business status, order queue, status controls, and QR redemption.
- Profile: account, language, addresses, payment placeholders, support, complaints, and merchant mode entry.

## Data Model

- Category: id, title, icon, color, merchant count.
- Merchant: id, categoryId, name, area, distance, rating, review count, open status, estimated time, fulfilment modes.
- Catalog item: id, merchantId, name, description, price, image/icon, options.
- Cart line: itemId, quantity, selected options, note.
- Order: id, merchantId, merchantName, type, status, lines, subtotal, discount, total, fulfilment, scheduled time, customer note, qr code.

## First Implementation Pass

The first pass should replace the app's visible product direction rather than preserve the old washing-only flow. Existing reusable pieces such as authentication, profile storage, cards, gradients, icons, toast, and multilingual wiring can remain if they support the new marketplace model.

## Verification

The rebuild is acceptable for the first pass when:

- Home no longer reads as a car-only app.
- Users can browse several merchant categories.
- Users can open a merchant, select items, and create an order with an auto-calculated total.
- Orders show mixed merchant/order types.
- Merchant console can update order statuses.
- TypeScript and lint checks pass.
