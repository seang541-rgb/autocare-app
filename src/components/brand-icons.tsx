import { Ionicons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Brand, Shadow } from '@/constants/brand';

type IconName = keyof typeof Ionicons.glyphMap;
type Tone = 'orange' | 'green' | 'blue' | 'navy';

type GlyphKind =
  | 'mark'
  | 'car'
  | 'food'
  | 'retail'
  | 'services'
  | 'merchant'
  | 'qr'
  | 'orders'
  | 'wallet'
  | 'support'
  | 'settings'
  | 'alert'
  | 'location'
  | 'ticket';

const ICON_KIND: Partial<Record<IconName, GlyphKind>> = {
  'car-sport': 'car',
  restaurant: 'food',
  cafe: 'food',
  flame: 'food',
  'bag-handle': 'retail',
  bag: 'retail',
  sparkles: 'services',
  cut: 'services',
  storefront: 'merchant',
  'storefront-outline': 'merchant',
  'qr-code-outline': 'qr',
  receipt: 'orders',
  'receipt-outline': 'orders',
  card: 'wallet',
  'card-outline': 'wallet',
  'logo-whatsapp': 'support',
  chatbubble: 'support',
  'chatbubble-outline': 'support',
  settings: 'settings',
  'settings-outline': 'settings',
  'alert-circle-outline': 'alert',
  location: 'location',
  'location-outline': 'location',
  ticket: 'ticket',
  'ticket-outline': 'ticket',
};

export function toneColor(tone: Tone = 'orange') {
  if (tone === 'green') return Brand.teal;
  if (tone === 'blue') return Brand.blue;
  if (tone === 'navy') return Brand.ink;
  return Brand.primary;
}

export function toneSoft(tone: Tone = 'orange') {
  if (tone === 'green') return Brand.tealSoft;
  if (tone === 'blue') return Brand.blueSoft;
  if (tone === 'navy') return Brand.cardAlt;
  return Brand.primarySoft;
}

export function toneForIcon(icon: IconName): Tone {
  const kind = ICON_KIND[icon];
  if (kind === 'food' || kind === 'retail' || kind === 'support') return 'green';
  if (kind === 'wallet' || kind === 'orders' || kind === 'qr') return 'blue';
  if (kind === 'settings') return 'navy';
  return 'orange';
}

export function BrandMark({ size = 44, inverted = false, style }: { size?: number; inverted?: boolean; style?: StyleProp<ViewStyle> }) {
  const stroke = inverted ? Brand.primary : '#fff';
  return (
    <View style={[styles.mark, { width: size, height: size, borderRadius: size * 0.34, backgroundColor: inverted ? '#fff' : Brand.primary }, style]}>
      <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 32 32">
        <Path d="M7 14c0-4.4 3.6-8 9-8s9 3.6 9 8c0 6-9 13-9 13S7 20 7 14Z" fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11 14h10M12 18h8M13 10h6" fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

export function BrandGlyph({ icon, kind, size = 28, color = Brand.ink }: { icon?: IconName; kind?: GlyphKind; size?: number; color?: string }) {
  const resolved = kind ?? (icon ? ICON_KIND[icon] : undefined);
  if (!resolved) return icon ? <Ionicons name={icon} size={size} color={color} /> : null;
  return <Svg width={size} height={size} viewBox="0 0 32 32">{paths(resolved, color)}</Svg>;
}

export function BrandIcon({ icon, kind, size = 48, tone, style }: { icon?: IconName; kind?: GlyphKind; size?: number; tone?: Tone; style?: StyleProp<ViewStyle> }) {
  const actualTone = tone ?? (icon ? toneForIcon(icon) : 'orange');
  const color = toneColor(actualTone);
  return (
    <View style={[styles.iconShell, { width: size, height: size, borderRadius: Math.max(14, size * 0.34), backgroundColor: toneSoft(actualTone) }, style]}>
      <BrandGlyph icon={icon} kind={kind} size={size * 0.58} color={color} />
    </View>
  );
}

function paths(kind: GlyphKind, color: string) {
  const p = (d: string) => <Path key={d} d={d} fill="none" stroke={color} strokeWidth={2.15} strokeLinecap="round" strokeLinejoin="round" />;
  switch (kind) {
    case 'mark':
      return [p('M7 14c0-4.4 3.6-8 9-8s9 3.6 9 8c0 6-9 13-9 13S7 20 7 14Z'), p('M11 14h10M12 18h8M13 10h6')];
    case 'car':
      return [p('M8 18h16l-2-6H10l-2 6Z'), p('M10 18v4M22 18v4M12 22h8'), p('M11 12c1-3 9-3 10 0')];
    case 'food':
      return [p('M10 8v16M22 8v16M10 16h12'), p('M15 8v16')];
    case 'retail':
      return [p('M9 11h14v14H9z'), p('M13 11c0-5 6-5 6 0'), p('M13 17h6')];
    case 'services':
      return [p('M16 6l2.1 5.6L24 14l-5.9 2.4L16 22l-2.1-5.6L8 14l5.9-2.4L16 6Z'), p('M23 20l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z')];
    case 'merchant':
      return [p('M8 22h16M10 22V10h12v12'), p('M13 14h6M13 18h6'), p('M11 10l2-3h6l2 3')];
    case 'qr':
      return [p('M8 8h6v6H8zM18 8h6v6h-6zM8 18h6v6H8z'), p('M19 19h5v5h-5z')];
    case 'orders':
      return [p('M10 8h12v16H10z'), p('M13 12h2M18 12h2M13 17h2M18 17h2M13 22h7')];
    case 'wallet':
      return [p('M8 11h16v12H8z'), p('M19 15h6v5h-6z'), p('M11 11V9h11v2')];
    case 'support':
      return [p('M8 10h16v11H13l-5 4V10Z'), p('M12 15h8M12 19h5')];
    case 'settings':
      return [p('M16 11a5 5 0 1 0 0 10a5 5 0 0 0 0-10Z'), p('M16 6v3M16 23v3M6 16h3M23 16h3M9 9l2 2M21 21l2 2M23 9l-2 2M11 21l-2 2')];
    case 'alert':
      return [p('M16 7l11 19H5L16 7Z'), p('M16 14v5M16 23h.1')];
    case 'location':
      return [p('M8 14c0-4.4 3.6-8 8-8s8 3.6 8 8c0 5.8-8 12-8 12S8 19.8 8 14Z'), p('M16 11.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z')];
    case 'ticket':
      return [p('M8 11h16v4a3 3 0 0 0 0 6v4H8v-4a3 3 0 0 0 0-6v-4Z'), p('M16 12v2M16 18v2M16 24v1')];
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  mark: { alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  iconShell: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(16,24,40,0.06)' },
});

