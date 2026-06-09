import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import type { CatalogItem, Category, FulfilmentMode, MarketplaceStatus, Merchant, Order, OrderLine, Promo, Service } from '@/constants/data';

export type Language = 'zh' | 'en' | 'ms';

type Dict = Record<string, string>;
type ServiceId = Service['id'];
type CatalogCopy = { name: string; desc: string };
type NotificationCopy = { title: string; body: string };

const en: Dict = {
  home: 'Home', booking: 'Explore', orders: 'Orders', staff: 'Merchant', profile: 'Me',
  language: 'Language', chinese: 'Chinese', english: 'English', malay: 'Bahasa Melayu',
  points: 'Points', remainingWash: 'Active orders', coupons: 'Vouchers', myVehicles: 'Car-care profile',
  paymentMethods: 'Payment methods', addressBook: 'Addresses', whatsappAiCare: 'WhatsApp / AI Care',
  complaintCenter: 'Complaint centre', settings: 'Settings', availableCoupons: '{count} available',
  supportMenuSub: 'Orders, payments, complaints', complaintMenuSub: 'Service follow-up tickets', logout: 'Log out',
  openNow: 'Open', closed: 'Closed', free: 'Free', none: 'None', add: 'Add', save: 'Save', delete: 'Delete', cancel: 'Cancel',
  all: 'All', usable: 'Usable', used: 'Used', expired: 'Expired', requiredFields: 'Please fill in the required fields.',
  savedToast: 'Saved.', deletedToast: 'Deleted.', packageIncluded: 'Package includes', chooseVehicle: 'Choose vehicle type',
  addOns: 'Add-ons', total: 'Total', chooseOutletSlot: 'Continue', promoCampaign: 'Promotion',
  quoteComingToast: 'This offer will be connected to marketplace checkout later.', freeQuote: 'Free quote', saveAmount: 'Save RM{amount}',
  promoBenefits: 'Benefits', promoTerms: 'Terms', promoPrice: 'Promo price', limitedOffer: 'Limited offer', zeroQuote: 'Free',
  cardDebit: 'Credit / debit card', fpxBank: 'FPX online banking', default: 'Default', setDefault: 'Set default',
  plateNo: 'Plate no.', vehicleModel: 'Vehicle model', vehicleYear: 'Year', addVehicle: 'Add vehicle',
  vehicleSub: 'Vehicle information for car-care bookings', noVehicles: 'No vehicles yet', couponSub: 'View marketplace voucher status and rules',
  couponRule: 'Rule', noCoupons: 'No vouchers in this category.', paymentSub: 'Manage payment placeholders for merchant checkout',
  addPayment: 'Add payment method', paymentName: 'Payment name', paymentDetail: 'Payment note', paymentPlaceholder: 'Example: Maybank FPX',
  paymentDetailPlaceholder: 'Example: Merchant bank account pending setup', addressSub: 'Manage pickup, service and billing addresses',
  addAddress: 'Add address', editAddress: 'Edit address', addressLabel: 'Address label', addressDetail: 'Full address',
  addressLabelPlaceholder: 'Example: Home / Office', addressDetailPlaceholder: 'Street, area and postcode', noAddresses: 'No addresses yet',
  memberQr: 'Member QR', memberQrSub: 'Show this for merchant membership and service verification', scanForMember: 'Show this QR to the merchant',
  send: 'Send', supportPlaceholder: 'Ask about orders, merchants or payments', quickQuestions: 'Quick questions',
  quickQueue: 'Merchant wait time', quickPayment: 'Payment status', quickChangeBooking: 'Change order', quickComplaintFollow: 'Complaint follow-up',
  supportSeedHello: 'Hi, I can help with merchant wait times, order changes, payment status and complaints.',
  aiQueueReply: 'SparkWash Kepong is currently fastest, and food pickup is around 18 minutes.',
  aiPaymentReply: 'Payment is still in demo mode. TnG, FPX and bank transfer can be connected when merchant accounts are ready.',
  aiComplaintReply: 'You can open a complaint ticket here. AI Care can keep WhatsApp follow-up enabled.',
  aiDefaultReply: 'I can help with order changes, merchant wait times, payment confirmation and complaint follow-up.',
  complaintTopic: 'Complaint topic', complaintDetail: 'Complaint detail', submitTicket: 'Submit ticket', open: 'Open', reviewing: 'Reviewing',
  resolved: 'Resolved', markResolved: 'Mark resolved', noComplaints: 'No complaint tickets yet', settingsSub: 'Notifications, AI Care and display preferences',
  bookingReminderSetting: 'Order reminders', paymentAlertSetting: 'Payment success alerts', whatsappFollowUpSetting: 'WhatsApp follow-up',
  darkHeaderSetting: 'Dark profile header', login: 'Log in', loginTitle: 'Log in', loginSub: 'Log in to manage orders, merchants and profile details.',
  registerTitle: 'Create account', registerSub: 'Create a local test account for this marketplace preview.', fullName: 'Full name',
  phoneNumber: 'Phone number', pinCode: '4-digit PIN', vehiclePlate: 'Vehicle plate', createAccount: 'Create account',
  noAccount: 'No account yet?', haveAccount: 'Already have an account?', invalidLogin: 'Phone number or PIN is incorrect.',
  accountExists: 'This phone number is already registered.', registerSuccess: 'Account created.', loginSuccess: 'Logged in.',
  orderDetail: 'Order detail', orderMissing: 'Order not found.', paid: 'Paid', date: 'Date', timeSlot: 'Time slot', outlet: 'Merchant',
  paymentStatus: 'Payment status', orderNo: 'Order no.', bookingTime: 'Order time', merchantTimeline: 'Merchant timeline', completeRedeem: 'Complete / redeem', moveToStatus: 'Move to {status}', orderUpdatedToast: 'Order {id} updated to {status}.', qrCompleted: 'This order is completed.', qrHintMerchant: 'Show this QR to the merchant when needed.', voucher: 'Voucher', note: 'Note',
  searchPlaceholder: 'Search food, wash, shops', merchantTools: 'Merchant tools', todayOverview: 'Today overview', readyOrders: 'Ready orders', preparingOrders: 'Preparing', marketplace: 'Marketplace', homeHeroTitle: 'Car wash, food and local merchants in one app.', homeHeroSub: 'Browse nearby businesses, order for pickup, book services, and let merchants manage the queue.',
  fastestNow: 'Fastest now: {name} - {mins} min', chooseCategory: 'Choose a category', viewAll: 'View all', featuredMerchants: 'Featured merchants', nearbyNow: 'Nearby now', promos: 'Promos',
  notificationsWhatsapp: 'Notifications & WhatsApp', merchantStats: '{distance} km - {mins} min', merchantQueue: '{area} - {mins} min - {queue} in queue',
  exploreTitle: 'Explore merchants', exploreSub: 'Choose food, car care, retail or services nearby.', allCategories: 'All', merchantPlatformReady: 'Merchant platform ready', merchantPlatformBody: 'This version supports customer browsing and a merchant console for order updates.',
  menuServices: 'Menu & services', popular: 'Popular', checkout: 'Checkout', fulfilment: 'Fulfilment', pickup: 'Pickup', service: 'Service', orderSummary: 'Order summary', customerNote: 'Customer note', notePlaceholder: 'Example: less spicy, call when ready',
  paymentMethod: 'Payment method', manualPayment: 'Manual / test confirmation', tngPlaceholder: "Touch 'n Go QR placeholder", bankPlaceholder: 'Bank transfer placeholder', subtotal: 'Subtotal', platformVoucher: 'Platform voucher', amountDue: 'Amount due', placeOrder: 'Place order', confirming: 'Confirming...', noItemsSelected: 'No items selected.',
  orderPlaced: 'Order placed', orderSentMerchant: 'Order {id} has been sent to the merchant.', allOrders: 'All orders', merchantView: 'Merchant view', successTipMarketplace: 'Merchant updates, payment confirmation and pickup reminders can be sent through WhatsApp.',
  myOrders: 'My orders', ordersSub: 'Track food, car care, retail and services in one place.', active: 'Active', history: 'History', noOrdersHere: 'No orders here yet.',
  merchantConsoleTitle: 'Merchant console', merchantConsoleSub: 'Accept orders, update status, and complete QR/service orders.', demoMerchantName: 'LokalGo Merchant HQ', demoMerchantSub: 'Managing todays merchant orders', liveOrders: 'Live orders', completed: 'Completed', revenue: 'Revenue', orderQueue: 'Order queue', noActiveOrders: 'No active orders.',
  accept: 'Accept', startPreparing: 'Start preparing', markReady: 'Mark ready', complete: 'Complete', noAddress: 'No address', noPaymentMethod: 'No payment method', marketplaceAccount: 'Marketplace account', activeOrders: 'Active orders', vouchers: 'Vouchers', addresses: 'Addresses', merchantMode: 'Merchant mode', merchantModeSub: 'Manage orders and status', carCareProfile: 'Car-care profile', carCareProfileSub: 'Vehicle info for wash bookings', explore: 'Explore', marketplaceRebuild: 'Marketplace rebuild', walletBalance: 'Wallet balance', scanPay: 'Scan & pay', rewards: 'Rewards', premiumPicks: 'Premium picks', quickActions: 'Quick actions', ordersToday: 'Orders today', settlement: 'Settlement', businessAccount: 'Business account', qrCounter: 'QR counter', merchantInsights: 'Merchant insights', topMerchant: 'Top merchant', sponsored: 'Sponsored',
};

const labels: Record<Language, Dict> = {
  en,
  zh: {
    ...en,
    home: '\u9996\u9875', booking: '\u63a2\u7d22', orders: '\u8ba2\u5355', staff: '\u5546\u5bb6', profile: '\u6211\u7684',
    language: '\u8bed\u8a00', chinese: '\u4e2d\u6587', points: '\u79ef\u5206', remainingWash: '\u8fdb\u884c\u4e2d\u8ba2\u5355',
    coupons: '\u4f18\u60e0\u5238', paymentMethods: '\u4ed8\u6b3e\u65b9\u5f0f', addressBook: '\u5730\u5740',
    complaintCenter: '\u6295\u8bc9\u4e2d\u5fc3', settings: '\u8bbe\u7f6e', logout: '\u9000\u51fa\u767b\u5f55',
    openNow: '\u8425\u4e1a\u4e2d', closed: '\u4f11\u606f\u4e2d', add: '\u6dfb\u52a0', save: '\u4fdd\u5b58', delete: '\u5220\u9664', cancel: '\u53d6\u6d88',
    login: '\u767b\u5f55', loginTitle: '\u767b\u5f55', registerTitle: '\u521b\u5efa\u8d26\u53f7', fullName: '\u59d3\u540d', phoneNumber: '\u624b\u673a\u53f7\u7801',
    createAccount: '\u521b\u5efa\u8d26\u53f7', savedToast: '\u5df2\u4fdd\u5b58', deletedToast: '\u5df2\u5220\u9664', requiredFields: '\u8bf7\u586b\u5199\u5fc5\u8981\u8d44\u6599',
    paymentStatus: '\u4ed8\u6b3e\u72b6\u6001', orderNo: '\u8ba2\u5355\u53f7', bookingTime: '\u8ba2\u5355\u65f6\u95f4', merchantTimeline: '\u5546\u5bb6\u8fdb\u5ea6', completeRedeem: '\u5b8c\u6210 / \u6838\u9500', moveToStatus: '\u66f4\u65b0\u5230 {status}', orderUpdatedToast: '\u8ba2\u5355 {id} \u5df2\u66f4\u65b0\u4e3a {status}', qrCompleted: '\u8fd9\u5f20\u8ba2\u5355\u5df2\u5b8c\u6210', qrHintMerchant: '\u9700\u8981\u65f6\u5411\u5546\u5bb6\u51fa\u793a\u6b64 QR', voucher: '\u4f18\u60e0', note: '\u5907\u6ce8',
    searchPlaceholder: '\u641c\u7d22\u9910\u996e\u3001\u6d17\u8f66\u3001\u5546\u5e97', merchantTools: '\u5546\u5bb6\u5de5\u5177', todayOverview: '\u4eca\u65e5\u603b\u89c8', readyOrders: '\u5df2\u51c6\u5907\u8ba2\u5355', preparingOrders: '\u5904\u7406\u4e2d', marketplace: '\u5e73\u53f0', homeHeroTitle: '\u6d17\u8f66\u3001\u9910\u5385\u548c\u672c\u5730\u5546\u5bb6\u90fd\u5728\u4e00\u4e2a App', homeHeroSub: '\u6d4f\u89c8\u9644\u8fd1\u5546\u5bb6\u3001\u81ea\u53d6\u4e0b\u5355\u3001\u9884\u7ea6\u670d\u52a1\u3001\u5546\u5bb6\u7ba1\u7406\u961f\u5217',
    fastestNow: '\u6700\u5feb\u73b0\u5728\uff1a{name} - {mins} \u5206\u949f', chooseCategory: '\u9009\u62e9\u5206\u7c7b', viewAll: '\u67e5\u770b\u5168\u90e8', featuredMerchants: '\u63a8\u8350\u5546\u5bb6', nearbyNow: '\u9644\u8fd1\u5546\u5bb6', promos: '\u4f18\u60e0',
    notificationsWhatsapp: '\u901a\u77e5\u4e0e WhatsApp', reviews: '{count} \u6761\u8bc4\u4ef7', inQueue: '\u961f\u5217 {count} \u5355', itemCount: '{count} \u4e2a\u9879\u76ee', exploreTitle: '\u63a2\u7d22\u5546\u5bb6', exploreSub: '\u9009\u62e9\u9644\u8fd1\u7684\u9910\u996e\u3001\u6d17\u8f66\u3001\u96f6\u552e\u6216\u670d\u52a1', allCategories: '\u5168\u90e8', merchantPlatformReady: '\u5546\u5bb6\u5e73\u53f0\u5df2\u51c6\u5907', merchantPlatformBody: '\u8fd9\u4e2a\u7248\u672c\u652f\u6301\u987e\u5ba2\u6d4f\u89c8\u548c\u5546\u5bb6\u7ba1\u7406\u8ba2\u5355',
    menuServices: '\u83dc\u5355\u4e0e\u670d\u52a1', popular: '\u70ed\u95e8', checkout: '\u7ed3\u8d26', fulfilment: '\u5c65\u7ea6\u65b9\u5f0f', pickup: '\u81ea\u53d6', service: '\u670d\u52a1', orderSummary: '\u8ba2\u5355\u6458\u8981', customerNote: '\u5ba2\u6237\u5907\u6ce8', notePlaceholder: '\u4f8b\u5982\uff1a\u5c11\u8fa3\u3001\u51c6\u5907\u597d\u540e\u901a\u77e5',
    paymentMethod: '\u4ed8\u6b3e\u65b9\u5f0f', manualPayment: '\u624b\u52a8 / \u6d4b\u8bd5\u786e\u8ba4', tngPlaceholder: 'Touch \'n Go QR \u5360\u4f4d', bankPlaceholder: '\u94f6\u884c\u8f6c\u8d26\u5360\u4f4d', subtotal: '\u5c0f\u8ba1', platformVoucher: '\u5e73\u53f0\u4f18\u60e0', amountDue: '\u5e94\u4ed8\u91d1\u989d', placeOrder: '\u4e0b\u5355', confirming: '\u786e\u8ba4\u4e2d...', noItemsSelected: '\u8fd8\u6ca1\u6709\u9009\u62e9\u9879\u76ee',
    orderPlaced: '\u8ba2\u5355\u5df2\u63d0\u4ea4', orderSentMerchant: '\u8ba2\u5355 {id} \u5df2\u53d1\u9001\u7ed9\u5546\u5bb6', allOrders: '\u5168\u90e8\u8ba2\u5355', merchantView: '\u5546\u5bb6\u89c6\u56fe', successTipMarketplace: '\u5546\u5bb6\u66f4\u65b0\u3001\u4ed8\u6b3e\u786e\u8ba4\u548c\u81ea\u53d6\u63d0\u9192\u53ef\u4ee5\u901a\u8fc7 WhatsApp \u53d1\u9001',
    myOrders: '\u6211\u7684\u8ba2\u5355', ordersSub: '\u7edf\u4e00\u8ffd\u8e2a\u9910\u996e\u3001\u6d17\u8f66\u3001\u96f6\u552e\u548c\u670d\u52a1\u8ba2\u5355', active: '\u8fdb\u884c\u4e2d', history: '\u5386\u53f2', noOrdersHere: '\u8fd9\u91cc\u8fd8\u6ca1\u6709\u8ba2\u5355',
    merchantConsoleTitle: '\u5546\u5bb6\u7ba1\u7406', merchantConsoleSub: '\u63a5\u5355\u3001\u66f4\u65b0\u72b6\u6001\u548c\u5b8c\u6210 QR / \u670d\u52a1\u8ba2\u5355', demoMerchantName: 'LokalGo Merchant HQ', demoMerchantSub: '\u7ba1\u7406\u4eca\u65e5\u5546\u5bb6\u8ba2\u5355', liveOrders: '\u5373\u65f6\u8ba2\u5355', completed: '\u5df2\u5b8c\u6210', revenue: '\u6536\u5165', orderQueue: '\u8ba2\u5355\u961f\u5217', noActiveOrders: '\u6ca1\u6709\u8fdb\u884c\u4e2d\u8ba2\u5355',
    accept: '\u63a5\u5355', startPreparing: '\u5f00\u59cb\u5904\u7406', markReady: '\u6807\u8bb0\u5df2\u51c6\u5907', complete: '\u5b8c\u6210', noAddress: '\u6682\u65e0\u5730\u5740', noPaymentMethod: '\u6682\u65e0\u4ed8\u6b3e\u65b9\u5f0f', marketplaceAccount: '\u5e73\u53f0\u8d26\u53f7', activeOrders: '\u8fdb\u884c\u4e2d\u8ba2\u5355', vouchers: '\u4f18\u60e0\u5238', addresses: '\u5730\u5740', merchantMode: '\u5546\u5bb6\u6a21\u5f0f', merchantModeSub: '\u7ba1\u7406\u8ba2\u5355\u548c\u8425\u4e1a\u72b6\u6001', carCareProfile: '\u6d17\u8f66\u8d44\u6599', carCareProfileSub: '\u7528\u4e8e\u6d17\u8f66\u9884\u7ea6\u7684\u8f66\u8f86\u8d44\u6599', explore: '\u63a2\u7d22', marketplaceRebuild: 'Marketplace \u6539\u7248',
  },
  ms: {
    ...en,
    home: 'Laman', booking: 'Teroka', orders: 'Pesanan', staff: 'Peniaga', profile: 'Saya', language: 'Bahasa',
    points: 'Mata', remainingWash: 'Pesanan aktif', coupons: 'Baucar', myVehicles: 'Profil penjagaan kereta',
    paymentMethods: 'Kaedah pembayaran', addressBook: 'Alamat', whatsappAiCare: 'WhatsApp / Khidmat AI', complaintCenter: 'Pusat aduan',
    settings: 'Tetapan', availableCoupons: '{count} tersedia', logout: 'Log keluar', openNow: 'Dibuka', closed: 'Ditutup',
    add: 'Tambah', save: 'Simpan', delete: 'Padam', cancel: 'Batal', usable: 'Boleh digunakan', used: 'Telah digunakan', expired: 'Tamat tempoh',
    quickQueue: 'Masa menunggu peniaga', quickPayment: 'Status bayaran', quickChangeBooking: 'Ubah pesanan', quickComplaintFollow: 'Susulan aduan', supportSeedHello: 'Hai, saya boleh bantu semak masa menunggu peniaga, perubahan pesanan, status bayaran dan aduan.', aiQueueReply: 'SparkWash Kepong paling cepat sekarang, manakala ambil sendiri makanan sekitar 18 minit.', aiPaymentReply: 'Bayaran masih dalam mod demo / pengesahan manual. TnG, FPX dan pindahan bank boleh disambungkan apabila akaun peniaga sudah sedia.', aiComplaintReply: 'Anda boleh membuka tiket aduan di sini. Khidmat AI boleh terus membantu susulan melalui WhatsApp.', aiChangeReply: 'Untuk pesanan ambil sendiri, hubungi peniaga sebelum pesanan ditanda sedia. Untuk tempahan, pilih slot baharu dari halaman butiran pesanan.', aiDefaultReply: 'Saya boleh bantu dengan perubahan pesanan, masa menunggu peniaga, pengesahan bayaran dan susulan aduan.',
    savedToast: 'Disimpan.', deletedToast: 'Dipadam.', requiredFields: 'Sila lengkapkan maklumat yang diperlukan.',
    login: 'Log masuk', loginTitle: 'Log masuk', registerTitle: 'Cipta akaun', fullName: 'Nama penuh', phoneNumber: 'Nombor telefon', pinCode: 'PIN 4 digit', createAccount: 'Cipta akaun',
    merchantTimeline: 'Perjalanan pesanan', completeRedeem: 'Lengkapkan / tebus', moveToStatus: 'Tukar kepada {status}', orderUpdatedToast: 'Pesanan {id} dikemas kini kepada {status}.', qrCompleted: 'Pesanan ini telah selesai.', qrHintMerchant: 'Tunjukkan QR ini kepada peniaga apabila diperlukan.', voucher: 'Baucar', note: 'Nota', reviews: '{count} ulasan', inQueue: '{count} dalam giliran', itemCount: '{count} item',
    searchPlaceholder: 'Cari makanan, cucian, kedai', merchantTools: 'Alat peniaga', todayOverview: 'Ringkasan hari ini', readyOrders: 'Pesanan sedia', preparingOrders: 'Sedang disediakan', marketplace: 'Pasaran', homeHeroTitle: 'Cuci kereta, makanan dan peniaga tempatan dalam satu app.', homeHeroSub: 'Cari peniaga berdekatan, buat pesanan ambil sendiri, tempah servis dan urus giliran peniaga.', fastestNow: 'Paling cepat: {name} - {mins} min', chooseCategory: 'Pilih kategori', viewAll: 'Lihat semua', featuredMerchants: 'Peniaga pilihan', nearbyNow: 'Berdekatan', promos: 'Promosi', notificationsWhatsapp: 'Notifikasi & WhatsApp',
    exploreTitle: 'Teroka peniaga', exploreSub: 'Pilih makanan, penjagaan kereta, runcit atau servis berdekatan.', allCategories: 'Semua', merchantPlatformReady: 'Platform peniaga sedia', merchantPlatformBody: 'Versi ini menyokong pelanggan melayari dan peniaga mengemas kini pesanan.',
    menuServices: 'Menu & servis', popular: 'Popular', checkout: 'Bayar', fulfilment: 'Kaedah pesanan', pickup: 'Ambil sendiri', service: 'Servis', orderSummary: 'Ringkasan pesanan', customerNote: 'Nota pelanggan', notePlaceholder: 'Contoh: kurang pedas, hubungi bila siap', paymentMethod: 'Kaedah pembayaran', manualPayment: 'Pengesahan manual / ujian', tngPlaceholder: "Ruang Touch 'n Go QR", bankPlaceholder: 'Ruang pindahan bank', subtotal: 'Jumlah kecil', platformVoucher: 'Baucar platform', amountDue: 'Jumlah perlu dibayar', placeOrder: 'Hantar pesanan', confirming: 'Mengesahkan...', noItemsSelected: 'Tiada item dipilih.',
    orderPlaced: 'Pesanan dihantar', orderSentMerchant: 'Pesanan {id} telah dihantar kepada peniaga.', allOrders: 'Semua pesanan', merchantView: 'Paparan peniaga', successTipMarketplace: 'Kemas kini peniaga, pengesahan bayaran dan peringatan ambil sendiri boleh dihantar melalui WhatsApp.',
    myOrders: 'Pesanan saya', ordersSub: 'Jejaki makanan, penjagaan kereta, runcit dan servis di satu tempat.', active: 'Aktif', history: 'Sejarah', noOrdersHere: 'Tiada pesanan di sini.', merchantConsoleTitle: 'Konsol peniaga', merchantConsoleSub: 'Terima pesanan, kemas kini status dan lengkapkan pesanan QR/servis.', demoMerchantName: 'Pusat Peniaga LokalGo', demoMerchantSub: 'Mengurus pesanan peniaga hari ini', liveOrders: 'Pesanan aktif', completed: 'Selesai', revenue: 'Hasil', orderQueue: 'Giliran pesanan', noActiveOrders: 'Tiada pesanan aktif.',
    accept: 'Terima', startPreparing: 'Mula sediakan', markReady: 'Tanda siap', complete: 'Selesai', noAddress: 'Tiada alamat', noPaymentMethod: 'Tiada kaedah bayaran', marketplaceAccount: 'Akaun pasaran', activeOrders: 'Pesanan aktif', vouchers: 'Baucar', addresses: 'Alamat', merchantMode: 'Mod peniaga', merchantModeSub: 'Urus pesanan dan status', carCareProfile: 'Profil penjagaan kereta', carCareProfileSub: 'Maklumat kenderaan untuk tempahan cuci', explore: 'Teroka', marketplaceRebuild: 'Binaan semula pasaran', walletBalance: 'Baki dompet', scanPay: 'Imbas & bayar', rewards: 'Ganjaran', premiumPicks: 'Pilihan premium', quickActions: 'Aksi pantas', ordersToday: 'Pesanan hari ini', settlement: 'Penyelesaian', businessAccount: 'Akaun perniagaan', qrCounter: 'Kaunter QR', merchantInsights: 'Cerapan peniaga', topMerchant: 'Peniaga popular', sponsored: 'Ditaja',
  },
};

const serviceCopy: Record<Language, Record<ServiceId, { name: string; desc: string }>> = {
  en: { wash: { name: 'Car wash', desc: 'Wash and vacuum' }, tyre: { name: 'Tyre care', desc: 'Alignment and inspection' }, detail: { name: 'Detailing', desc: 'Interior and polish' } },
  zh: { wash: { name: '\u6d17\u8f66', desc: '\u6e05\u6d17\u4e0e\u5438\u5c18' }, tyre: { name: '\u8f6e\u80ce\u4fdd\u517b', desc: '\u5b9a\u4f4d\u4e0e\u68c0\u67e5' }, detail: { name: '\u7f8e\u5bb9\u62a4\u7406', desc: '\u5185\u9970\u4e0e\u6253\u8721' } },
  ms: { wash: { name: 'Cuci kereta', desc: 'Cuci dan vakum' }, tyre: { name: 'Penjagaan tayar', desc: 'Penjajaran dan pemeriksaan' }, detail: { name: 'Perincian kereta', desc: 'Dalaman dan gilap' } },
};

const vehicleSpecs: Record<Language, Record<string, string>> = {
  en: { sedan: 'Sedan', suv: 'SUV / MPV', big: 'Large vehicle' },
  zh: { sedan: '\u8f7f\u8f66', suv: 'SUV / MPV', big: '\u5927\u578b\u8f66\u8f86' },
  ms: { sedan: 'Sedan', suv: 'SUV / MPV', big: 'Kenderaan besar' },
};

const addOns: Record<Language, Record<string, { name: string; desc: string }>> = {
  en: { vacuum: { name: 'Interior vacuum', desc: 'Included with selected packages' }, wax: { name: 'Quick wax', desc: 'Extra shine' }, tyre: { name: 'Tyre shine', desc: 'Clean tyre wall' }, fragrance: { name: 'Cabin fragrance', desc: 'Fresh cabin scent' } },
  zh: { vacuum: { name: '\u8f66\u5185\u5438\u5c18', desc: '\u90e8\u5206\u5957\u9910\u5df2\u5305\u542b' }, wax: { name: '\u5feb\u901f\u6253\u8721', desc: '\u63d0\u5347\u4eae\u5ea6' }, tyre: { name: '\u8f6e\u80ce\u4e0a\u5149', desc: '\u6e05\u6d01\u8f6e\u80ce' }, fragrance: { name: '\u8f66\u5185\u9999\u6c1b', desc: '\u4fdd\u6301\u6e05\u65b0' } },
  ms: { vacuum: { name: 'Vakum dalaman', desc: 'Termasuk pakej tertentu' }, wax: { name: 'Lilin pantas', desc: 'Kilatan tambahan' }, tyre: { name: 'Kilatan tayar', desc: 'Bersihkan tayar' }, fragrance: { name: 'Pewangi kabin', desc: 'Bau kabin segar' } },
};

const included: Record<Language, string[]> = {
  en: ['Pre-rinse', 'Foam wash', 'Rim cleaning', 'Clean water rinse', 'Air dry', 'Basic check'],
  zh: ['\u9884\u51b2\u6d17', '\u6ce1\u6cab\u6e05\u6d17', '\u8f6e\u5708\u6e05\u6d01', '\u6e05\u6c34\u51b2\u6d17', '\u98ce\u5e72', '\u57fa\u7840\u68c0\u67e5'],
  ms: ['Pra-bilas', 'Cucian buih', 'Cucian rim', 'Bilas air bersih', 'Pengeringan udara', 'Pemeriksaan asas'],
};

const categoryCopy: Record<Language, Record<string, { name: string; subtitle: string }>> = {
  en: {
    'car-care': { name: 'Car care', subtitle: 'Wash, tyres, detailing' },
    food: { name: 'Food', subtitle: 'Restaurants and cafes' },
    retail: { name: 'Retail', subtitle: 'Shops and convenience' },
    services: { name: 'Services', subtitle: 'Beauty, repair, errands' },
  },
  zh: {
    'car-care': { name: '\u6d17\u8f66\u4fdd\u517b', subtitle: '\u6d17\u8f66\u3001\u8f6e\u80ce\u3001\u7f8e\u5bb9' },
    food: { name: '\u9910\u996e', subtitle: '\u9910\u5385\u4e0e\u5496\u5561\u5e97' },
    retail: { name: '\u96f6\u552e', subtitle: '\u5546\u5e97\u4e0e\u4fbf\u5229\u5e97' },
    services: { name: '\u672c\u5730\u670d\u52a1', subtitle: '\u7f8e\u5bb9\u3001\u7ef4\u4fee\u3001\u4ee3\u529e' },
  },
  ms: {
    'car-care': { name: 'Penjagaan kereta', subtitle: 'Cucian, tayar dan detailing' },
    food: { name: 'Makanan', subtitle: 'Restoran dan kafe' },
    retail: { name: 'Runcit', subtitle: 'Kedai dan barangan harian' },
    services: { name: 'Perkhidmatan', subtitle: 'Dandanan, baik pulih dan urusan' },
  },
};

const merchantHeroCopy: Record<Language, Record<string, string>> = {
  en: {
    'm-wash-kepong': 'Fast lane car wash',
    'm-nasi-lemak': 'Local meals ready for pickup',
    'm-kopi': 'Coffee and pastries',
    'm-mini-mart': 'Daily essentials',
    'm-barber': 'Appointments and walk-ins',
  },
  zh: {
    'm-wash-kepong': '\u5feb\u901f\u901a\u9053\u6d17\u8f66',
    'm-nasi-lemak': '\u672c\u5730\u7f8e\u98df\u81ea\u53d6',
    'm-kopi': '\u5496\u5561\u4e0e\u70d8\u7119',
    'm-mini-mart': '\u65e5\u5e38\u5fc5\u9700\u54c1',
    'm-barber': '\u9884\u7ea6\u4e0e\u73b0\u573a\u670d\u52a1',
  },
  ms: {
    'm-wash-kepong': 'Cucian kereta laluan pantas',
    'm-nasi-lemak': 'Hidangan tempatan sedia untuk ambil sendiri',
    'm-kopi': 'Kopi dan pastri',
    'm-mini-mart': 'Keperluan harian',
    'm-barber': 'Temujanji dan pelanggan walk-in',
  },
};

const catalogCopy: Record<Language, Record<string, CatalogCopy>> = {
  en: {
    'wash-basic': { name: 'Express wash', desc: 'Exterior wash and quick dry' },
    'wash-vacuum': { name: 'Wash + vacuum', desc: 'Exterior wash with interior vacuum' },
    'detail-small': { name: 'Mini detailing', desc: 'Interior wipe, wax shine, tyre dressing' },
    'nasi-classic': { name: 'Classic nasi lemak', desc: 'Rice, sambal, egg, peanuts, anchovies' },
    'ayam-rempah': { name: 'Ayam rempah set', desc: 'Spiced fried chicken with nasi lemak' },
    'kopi-o': { name: 'Kopi O ais', desc: 'Local iced black coffee' },
    latte: { name: 'Cafe latte', desc: 'Fresh espresso with steamed milk' },
    'mart-snack': { name: 'Snack bundle', desc: 'Chips, drink and tissue pack' },
    'mart-water': { name: 'Mineral water 6-pack', desc: 'Pickup-ready household pack' },
    'barber-cut': { name: 'Classic haircut', desc: 'Men haircut with styling' },
    'barber-shave': { name: 'Haircut + shave', desc: 'Full grooming appointment' },
  },
  zh: {
    'wash-basic': { name: '\u5feb\u901f\u6d17\u8f66', desc: '\u5916\u89c2\u6e05\u6d17\u4e0e\u5feb\u901f\u98ce\u5e72' },
    'wash-vacuum': { name: '\u6d17\u8f66 + \u5438\u5c18', desc: '\u5916\u89c2\u6e05\u6d17\u52a0\u8f66\u5185\u5438\u5c18' },
    'detail-small': { name: '\u8f7b\u7f8e\u5bb9\u62a4\u7406', desc: '\u5185\u9970\u64e6\u62ed\u3001\u4e0a\u8721\u3001\u8f6e\u80ce\u4e0a\u5149' },
    'nasi-classic': { name: '\u7ecf\u5178\u6930\u6d46\u996d', desc: '\u7c73\u996d\u3001\u53c1\u5df4\u3001\u9e21\u86cb\u3001\u82b1\u751f\u3001\u6c5f\u9c7c\u4ed4' },
    'ayam-rempah': { name: '\u9999\u6599\u70b8\u9e21\u5957\u9910', desc: '\u9999\u6599\u70b8\u9e21\u914d\u6930\u6d46\u996d' },
    'kopi-o': { name: '\u51b0\u5496\u5561 O', desc: '\u672c\u5730\u51b0\u9ed1\u5496\u5561' },
    latte: { name: '\u62ff\u94c1\u5496\u5561', desc: '\u73b0\u716e\u6d53\u7f29\u5496\u5561\u914d\u84b8\u5976' },
    'mart-snack': { name: '\u96f6\u98df\u5957\u88c5', desc: '\u85af\u7247\u3001\u996e\u6599\u548c\u7eb8\u5dfe\u5957\u88c5' },
    'mart-water': { name: '\u77ff\u6cc9\u6c34 6 \u652f\u88c5', desc: '\u53ef\u81ea\u53d6\u7684\u5bb6\u7528\u88c5' },
    'barber-cut': { name: '\u7ecf\u5178\u7406\u53d1', desc: '\u7537\u58eb\u7406\u53d1\u4e0e\u9020\u578b' },
    'barber-shave': { name: '\u7406\u53d1 + \u4fee\u9762', desc: '\u5168\u5957\u7537\u58eb\u4fee\u62a4\u9884\u7ea6' },
  },
  ms: {
    'wash-basic': { name: 'Cucian ekspres', desc: 'Cucian luaran dan pengeringan pantas' },
    'wash-vacuum': { name: 'Cuci + vakum', desc: 'Cucian luaran bersama vakum dalaman' },
    'detail-small': { name: 'Detailing ringan', desc: 'Lap dalaman, kilatan lilin dan rawatan tayar' },
    'nasi-classic': { name: 'Nasi lemak klasik', desc: 'Nasi, sambal, telur, kacang dan ikan bilis' },
    'ayam-rempah': { name: 'Set ayam rempah', desc: 'Ayam goreng berempah bersama nasi lemak' },
    'kopi-o': { name: 'Kopi O ais', desc: 'Kopi hitam ais tempatan' },
    latte: { name: 'Kafe latte', desc: 'Espresso segar bersama susu kukus' },
    'mart-snack': { name: 'Set snek', desc: 'Kerepek, minuman dan pek tisu' },
    'mart-water': { name: 'Air mineral 6 botol', desc: 'Pek isi rumah sedia untuk ambil sendiri' },
    'barber-cut': { name: 'Gunting rambut klasik', desc: 'Gunting rambut lelaki bersama gaya' },
    'barber-shave': { name: 'Gunting + cukur', desc: 'Temujanji dandanan penuh' },
  },
};

const statusCopy: Record<Language, Record<MarketplaceStatus, string>> = {
  en: { new: 'New', accepted: 'Accepted', preparing: 'Preparing', ready: 'Ready', completed: 'Completed', cancelled: 'Cancelled' },
  zh: { new: '\u65b0\u8ba2\u5355', accepted: '\u5df2\u63a5\u5355', preparing: '\u5904\u7406\u4e2d', ready: '\u5df2\u51c6\u5907', completed: '\u5df2\u5b8c\u6210', cancelled: '\u5df2\u53d6\u6d88' },
  ms: { new: 'Pesanan baharu', accepted: 'Diterima', preparing: 'Sedang disediakan', ready: 'Sedia', completed: 'Selesai', cancelled: 'Dibatalkan' },
};

const fulfilmentCopy: Record<Language, Record<FulfilmentMode, string>> = {
  en: { booking: 'Booking', pickup: 'Pickup', service: 'Service' },
  zh: { booking: '\u9884\u7ea6', pickup: '\u81ea\u53d6', service: '\u670d\u52a1' },
  ms: { booking: 'Tempahan', pickup: 'Ambil sendiri', service: 'Servis' },
};

const promoCopy: Record<Language, Record<string, Partial<Promo>>> = {
  en: {},
  zh: {
    p1: { title: '\u81ea\u53d6\u7701 RM2', sub: '\u9910\u996e\u4e0e\u96f6\u552e\u5546\u5bb6', tag: '\u81ea\u53d6', fullTitle: '\u81ea\u53d6\u4f18\u60e0', ctaText: '\u4f7f\u7528\u4f18\u60e0', bullets: ['RM20 \u4ee5\u4e0a\u81ea\u53d6\u8ba2\u5355\u53ef\u7528', '\u7ed3\u8d26\u65f6\u81ea\u52a8\u5957\u7528'], terms: ['\u5e02\u573a\u9884\u89c8\u7248\u793a\u8303\u4f18\u60e0'] },
    p2: { title: '\u6d17\u8f66\u4f18\u60e0', sub: '\u5feb\u901f\u901a\u9053\u9884\u7ea6', tag: '\u6d17\u8f66', fullTitle: '\u6d17\u8f66\u4fdd\u517b\u4f18\u60e0', ctaText: '\u7acb\u5373\u9884\u7ea6', bullets: ['\u4ec5\u9650\u6307\u5b9a\u5546\u5bb6'], terms: ['\u4ee5\u5546\u5bb6\u53ef\u7528\u65f6\u95f4\u4e3a\u51c6'] },
  },
  ms: {
    p1: { title: 'Diskaun RM2 ambil sendiri', sub: 'Untuk peniaga makanan dan runcit', tag: 'Ambil sendiri', fullTitle: 'Penjimatan Ambil Sendiri', ctaText: 'Guna baucar', bullets: ['Sah untuk pesanan ambil sendiri melebihi RM20', 'Digunakan secara automatik semasa bayaran'], terms: ['Baucar demo untuk pratonton marketplace'] },
    p2: { title: 'Promosi cuci kereta', sub: 'Temujanji laluan pantas', tag: 'Penjagaan kereta', fullTitle: 'Promosi Penjagaan Kereta', ctaText: 'Tempah sekarang', bullets: ['Untuk peniaga terpilih sahaja'], terms: ['Tertakluk kepada ketersediaan peniaga'] },
  },
};

const notificationCopy: Record<Language, Record<string, NotificationCopy>> = {
  en: {},
  zh: {
    n1: { title: '\u8ba2\u5355\u5df2\u63a5\u53d7', body: 'Nasi Lemak Station \u5df2\u63a5\u53d7\u60a8\u7684\u81ea\u53d6\u8ba2\u5355' },
    n2: { title: '\u5546\u5bb6\u66f4\u65b0', body: 'SparkWash Kepong \u76ee\u524d\u6709 3 \u8f86\u8f66\u6392\u961f\uff0c\u9884\u8ba1 12 \u5206\u949f' },
    n3: { title: 'WhatsApp \u5ba2\u670d', body: '\u4ed8\u6b3e\u786e\u8ba4\u548c\u8ba2\u5355\u63d0\u9192\u53ef\u4ee5\u901a\u8fc7 WhatsApp \u53d1\u9001' },
  },
  ms: {
    n1: { title: 'Pesanan diterima', body: 'Nasi Lemak Station telah menerima pesanan ambil sendiri anda.' },
    n2: { title: 'Kemas kini peniaga', body: 'SparkWash Kepong mempunyai 3 kereta dalam giliran, anggaran 12 minit.' },
    n3: { title: 'Khidmat WhatsApp', body: 'Pengesahan bayaran dan peringatan pesanan boleh dihantar melalui WhatsApp.' },
  },
};

type I18nStore = {
  lang: Language; setLang: (lang: Language) => void; t: (key: string, vars?: Record<string, string | number>) => string;
  serviceName: (id: ServiceId) => string; serviceDesc: (id: ServiceId) => string; outletName: (id: string, fallback?: string) => string;
  orderService: (order: Pick<Order, 'service' | 'lines'>) => string; promoTitle: (promo: Pick<Promo, 'title'>) => string; promoSub: (promo: Pick<Promo, 'sub'>) => string;
  promoDetail: (promo: Promo) => { title: string; sub: string; fullTitle: string; tag: string; unit: string; ctaText: string; bullets: string[]; terms: string[] };
  notification: (_id: string, fallback: NotificationCopy) => NotificationCopy; dateLabel: (label: string, week: string) => string;
  categoryName: (category: Category) => string; categorySubtitle: (category: Category) => string; merchantHero: (merchant: Merchant) => string; catalogItemName: (item: CatalogItem | OrderLine) => string; catalogItemDesc: (item: CatalogItem) => string; orderLineName: (line: OrderLine) => string; statusText: (status: MarketplaceStatus) => string; fulfilmentText: (mode: FulfilmentMode) => string;
  vehicleSpec: (id: string) => string; addOn: (id: string) => { name: string; desc: string }; includedItems: () => string[];
};

const Ctx = createContext<I18nStore | null>(null);

function format(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return Object.entries(vars).reduce((out, [key, value]) => out.replaceAll(`{${key}}`, String(value)), template);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const store = useMemo<I18nStore>(() => {
    const dict = labels[lang];
    return {
      lang, setLang,
      t: (key, vars) => format(dict[key] ?? en[key] ?? key, vars),
      serviceName: (id) => serviceCopy[lang][id]?.name ?? serviceCopy.en[id]?.name ?? id,
      serviceDesc: (id) => serviceCopy[lang][id]?.desc ?? serviceCopy.en[id]?.desc ?? id,
      outletName: (_id, fallback) => fallback ?? _id,
      orderService: (order) => order.lines?.[0]?.name ?? order.service,
      promoTitle: (promo) => promo.title,
      promoSub: (promo) => promo.sub,
promoDetail: (promo) => {
        const copy = promoCopy[lang][promo.id] ?? {};
        return { title: copy.title ?? promo.title, sub: copy.sub ?? promo.sub, fullTitle: copy.fullTitle ?? promo.fullTitle, tag: copy.tag ?? promo.tag, unit: copy.unit ?? promo.unit, ctaText: copy.ctaText ?? promo.ctaText, bullets: copy.bullets ?? promo.bullets, terms: copy.terms ?? promo.terms };
      },
      notification: (id, fallback) => notificationCopy[lang][id] ?? fallback,
      dateLabel: (label, week) => label || week,
      categoryName: (category) => categoryCopy[lang][category.id]?.name ?? category.name,
      categorySubtitle: (category) => categoryCopy[lang][category.id]?.subtitle ?? category.subtitle,
      merchantHero: (merchant) => merchantHeroCopy[lang][merchant.id] ?? merchant.hero,
      catalogItemName: (item) => {
        const id = 'itemId' in item ? item.itemId : item.id;
        return catalogCopy[lang][id]?.name ?? item.name;
      },
      catalogItemDesc: (item) => catalogCopy[lang][item.id]?.desc ?? item.desc,
      orderLineName: (line) => catalogCopy[lang][line.itemId]?.name ?? line.name,
      statusText: (status) => statusCopy[lang][status] ?? statusCopy.en[status],
      fulfilmentText: (mode) => fulfilmentCopy[lang][mode] ?? fulfilmentCopy.en[mode],
      vehicleSpec: (id) => vehicleSpecs[lang][id] ?? vehicleSpecs.en[id] ?? id,
      addOn: (id) => addOns[lang][id] ?? addOns.en[id] ?? { name: id, desc: '' },
      includedItems: () => included[lang] ?? included.en,
    };
  }, [lang]);
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export const I18nProvider = LanguageProvider;

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider');
  return ctx;
}














