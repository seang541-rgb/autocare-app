# JagaCar

JagaCar is a Malaysia-focused car care booking app demo built with Expo, React Native, and TypeScript.

The name comes from "jaga", meaning to look after or take care of something. The product direction is a practical mobile app for booking nearby car wash and maintenance services.

## Current Features

- Nearby outlet availability with queue count, opening status, estimated waiting time, and a map-style panel.
- Car wash booking flow with service selection, add-ons, outlet/time slot selection, payment simulation, QR code, and redemption.
- WhatsApp-style notification and AI customer service entry points.
- Reviews, outlet comments, and complaint submission after service completion.
- Staff redemption tab for today's bookings and simulated QR redemption.
- Chinese, English, and Bahasa Melayu language switcher.

## Tech Stack

| Area | Stack |
|---|---|
| Framework | Expo SDK 56, React Native 0.85 |
| Routing | expo-router |
| Language | TypeScript |
| UI | expo-linear-gradient, @expo/vector-icons, react-native-qrcode-svg |
| State | React Context |

## Local Run

```bash
npm install
npm start
npm run web
npm run android
```

## Notes

This is still a pure frontend demo with simulated data. Production work should add backend persistence, payment integration, secure QR redemption, and real WhatsApp notification APIs.
