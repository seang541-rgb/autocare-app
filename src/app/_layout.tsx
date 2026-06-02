import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 19, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: Brand.textSub,
        tabBarStyle: {
          backgroundColor: Brand.card,
          borderTopColor: Brand.border,
          // 系统导航条高度 + 内容区，避免与手机底部手势条重叠
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarItemStyle: { paddingTop: 2 },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: '首页', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="booking"
        options={{ title: '预约', tabBarIcon: ({ focused }) => <TabIcon emoji="📅" focused={focused} /> }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: '订单', tabBarIcon: ({ focused }) => <TabIcon emoji="🧾" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: '我的', tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tabs>
  );
}
