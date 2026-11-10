/**
 * StrawHub design tokens.
 * Farmer-first palette: readable in daylight, high contrast, green primary.
 * Status colors are always paired with a text label in the UI.
 */

export const Colors = {
  light: {
    background: '#F4F6F3',
    surface: '#FFFFFF',
    surfaceMuted: '#EDF1EC',
    text: '#17211C',
    textSecondary: '#57645D',
    border: 'rgba(23,33,28,0.10)',
    accent: '#1E7A4F',
    accentMuted: '#E3F1E9',
    warning: '#8A5A00',
    warningMuted: '#FCF1D8',
    danger: '#B3362B',
    dangerMuted: '#FBE3E0',
    info: '#205A8F',
    infoMuted: '#E2EDF6',
  },
  dark: {
    background: '#0D1311',
    surface: '#151F1B',
    surfaceMuted: '#1C2823',
    text: '#E9EEEA',
    textSecondary: '#9AA79F',
    border: 'rgba(233,238,234,0.10)',
    accent: '#4CC38A',
    accentMuted: '#173226',
    warning: '#F0C36B',
    warningMuted: '#332A14',
    danger: '#F0938A',
    dangerMuted: '#361C19',
    info: '#7EB3E8',
    infoMuted: '#142431',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

export const Typography = {
  title: 24,
  heading: 17,
  body: 14,
  caption: 12,
  micro: 10,
} as const;

export const MaxContentWidth = 720;
