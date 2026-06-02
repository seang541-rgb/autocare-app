# AutoCare 🚗

汽车养护一站式预约 App（DEMO）—— 参考马来西亚 KeyAuto WeK4U，聚焦**洗车下单完整闭环**。

使用 Expo (React Native) + TypeScript 构建，渐变设计 + 矢量图标，纯前端模拟数据。

## ✨ 功能

- **首页**：渐变英雄区、套餐进度、促销轮播、服务宫格、附近门店、通知弹窗
- **洗车下单闭环**：套餐详情（选车型 + 加购）→ 确认订单（门店/时段/支付方式）→ 模拟支付 → 支付成功 → 订单二维码 → 模拟扫码核销
- **促销详情页**：月卡 / RM1 体验 / 车险续保，各自独立详情，可下单
- **订单管理**：进行中 / 已完成、订单详情、二维码核销、改期
- **我的**：会员卡、车辆、积分、菜单

## 🛠 技术栈

| 类别 | 技术 |
|---|---|
| 框架 | Expo SDK 56 · React Native 0.85 |
| 路由 | expo-router（文件式路由 + 堆栈） |
| 语言 | TypeScript |
| UI | expo-linear-gradient · @expo/vector-icons · react-native-qrcode-svg |
| 状态 | React Context（订单 / Toast） |

## 🚀 本地运行

```bash
npm install
npm start        # 扫码用 Expo Go 真机预览
npm run web      # 浏览器预览
npm run android  # Android
```

## 📦 打包 APK

```bash
npx eas build -p android --profile preview
```

## 📁 结构

```
src/
├── app/                    # 路由（文件即页面）
│   ├── (tabs)/             # 底部 4 个 Tab
│   ├── service/[id].tsx    # 套餐详情
│   ├── confirm.tsx         # 确认订单 + 支付
│   ├── success.tsx         # 支付成功
│   ├── order/[id].tsx      # 订单详情 + 二维码 + 改期
│   └── promo/[id].tsx      # 促销详情
├── components/ui.tsx       # 通用组件
├── constants/              # 设计系统 + 模拟数据
└── store/                  # 全局状态（订单 / Toast）
```

> DEMO 阶段，纯前端模拟数据，未接后端。
