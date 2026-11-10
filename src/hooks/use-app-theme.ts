import { Colors } from '@/constants/theme';

/**
 * Single light organic scheme — no dark mode in v1 (design.md §3).
 * `palette` keeps semantic aliases so screens never hardcode hex values;
 * `brand` exposes the raw AgroTech tokens for cases the semantics don't cover.
 */
export function useAppTheme() {
  const palette = {
    // Surfaces
    background: Colors.cream,
    surface: '#FFFFFF',
    surfaceMuted: Colors.cream,
    // Text
    text: Colors.soil,
    textSecondary: Colors.muted,
    // Lines
    border: Colors.sand,
    // Primary
    accent: Colors.forest,
    accentMuted: '#E5EBD9', // leaf @ ~20%
    // Alert — coral is the single warning/danger tone
    warning: Colors.coral,
    warningMuted: Colors.coralSoft,
    danger: Colors.coral,
    dangerMuted: Colors.coralSoft,
    // Positive / in-progress
    info: Colors.moss,
    infoMuted: '#EDF1E4', // moss @ ~15%
  };
  return { palette, brand: Colors };
}
