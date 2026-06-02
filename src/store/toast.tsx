import { Ionicons } from '@expo/vector-icons';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { Brand, Radius, Shadow } from '@/constants/brand';

type ToastCtx = (msg: string) => void;
const Ctx = createContext<ToastCtx>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (m: string) => {
      setMsg(m);
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timerRef.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setMsg(null));
      }, 1600);
    },
    [opacity],
  );

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      {msg && (
        <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]}>
          <Ionicons name="information-circle" size={18} color="#fff" />
          <Text style={styles.text}>{msg}</Text>
        </Animated.View>
      )}
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '80%',
    backgroundColor: Brand.ink,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.pill,
    ...Shadow.soft,
  },
  text: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
