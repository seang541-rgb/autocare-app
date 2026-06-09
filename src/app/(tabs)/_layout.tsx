import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Radius, Shadow } from '@/constants/brand';
import { useI18n } from '@/store/i18n';

type IconName = keyof typeof Ionicons.glyphMap;
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

type TabItem = {
  route: string;
  label: string;
  active: IconName;
  inactive: IconName;
};

export default function TabLayout() {
  const { t } = useI18n();
  const tabs: TabItem[] = [
    { route: 'index', label: t('home'), active: 'home', inactive: 'home-outline' },
    { route: 'booking', label: t('booking'), active: 'compass', inactive: 'compass-outline' },
    { route: 'orders', label: t('orders'), active: 'receipt', inactive: 'receipt-outline' },
    { route: 'staff', label: t('staff'), active: 'storefront', inactive: 'storefront-outline' },
    { route: 'profile', label: t('profile'), active: 'person', inactive: 'person-outline' },
  ];

  return (
    <Tabs tabBar={(props) => <LokalTabBar {...props} tabs={tabs} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: t('home') }} />
      <Tabs.Screen name="booking" options={{ title: t('booking') }} />
      <Tabs.Screen name="orders" options={{ title: t('orders') }} />
      <Tabs.Screen name="staff" options={{ title: t('staff') }} />
      <Tabs.Screen name="profile" options={{ title: t('profile') }} />
    </Tabs>
  );
}

function LokalTabBar({ state, navigation, tabs }: TabBarProps & { tabs: TabItem[] }) {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.wrap, { paddingBottom: safeBottom }]}> 
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tab = tabs.find((item) => item.route === route.name) ?? tabs[0];
          const color = focused ? Brand.primary : '#98A2B3';
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={styles.item}>
              <View style={[styles.iconBubble, focused && styles.iconBubbleOn]}>
                <Ionicons name={focused ? tab.active : tab.inactive} size={21} color={color} />
              </View>
              <Text style={[styles.label, focused && styles.labelOn]} numberOfLines={1}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Brand.card,
    borderTopWidth: 1,
    borderTopColor: Brand.border,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    ...Shadow.card,
  },
  bar: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
  },
  item: {
    flex: 1,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconBubble: {
    width: 34,
    height: 30,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconBubbleOn: {
    backgroundColor: Brand.primarySoft,
  },
  label: {
    width: '100%',
    color: '#98A2B3',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  labelOn: {
    color: Brand.primary,
  },
});
