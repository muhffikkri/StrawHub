import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export function useAppTheme() {
  const scheme = useColorScheme();
  const palette = scheme === 'dark' ? Colors.dark : Colors.light;
  return { palette, isDark: scheme === 'dark' };
}
