/**
 * StrawHub design tokens.
 * Basis: AgroTech Precision / AquaCrop design system (v1.0.4 spec) —
 * organic light scheme, editorial serif × modern sans, pill touchpoints.
 * See design.md for the full rules.
 */

export const Colors = {
  // Primary
  forest: '#2F3E1E', // dark hero pill CTA, headers, active chips
  forestDark: '#233016', // pressed forest
  moss: '#5A7341', // banner alerts, positive badges, highlights
  mossHover: '#4E6538', // pressed moss
  leaf: '#7F9C57', // gauges, toggle fill, accents

  // Surfaces
  cream: '#F6F4ED', // main application screen background
  creamLight: '#FAF8F2', // elevated light surface
  creamDark: '#EFECE2', // inset fills, secondary chips

  // Text
  soil: '#1F2417', // headlines, primary metrics, strong labels
  muted: '#697060', // secondary text, captions
  hint: '#9BA193', // placeholders, timestamps

  // Alert
  coral: '#D97757', // warnings, alerts, blockers, negative values
  coralSoft: '#FBF0EC', // warning fills, simulated-data notices

  // Lines
  sand: '#E6E3D8', // borders, dividers, inactive tracks
} as const;

export type ThemeColor = keyof typeof Colors;

/**
 * Font families. Newsreader carries headings and metric values;
 * Plus Jakarta Sans carries body, interface, and data labels.
 * Loaded in src/app/_layout.tsx via @expo-google-fonts packages.
 */
export const Fonts = {
  serif: {
    regular: 'Newsreader_400Regular',
    medium: 'Newsreader_500Medium',
    semibold: 'Newsreader_600SemiBold',
    italic: 'Newsreader_400Regular_Italic',
    italicMedium: 'Newsreader_500Medium_Italic',
  },
  sans: {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semibold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  md: 16, // inner tiles, inputs, inset cards
  lg: 24, // cards
  pill: 9999, // buttons, badges, chips, segmented controls
} as const;

/** Serif headline / metric scale (Newsreader). */
export const Typography = {
  display: 40, // display hero
  headline: 28, // screen headline
  title: 22, // card title
  metric: 34, // large metric hero
  value: 26, // telemetry / KPI value
  subtitle: 18, // editorial italic subtitle
  body: 14, // sans body UI
  caption: 12, // sans caption
  micro: 11, // sans micro eyebrow, uppercase
} as const;

/**
 * Forest-tinted elevation, matching the sticker sheet shadows.
 * iOS uses shadow*; Android uses elevation.
 */
export const Shadows = {
  soft: {
    shadowColor: '#2F3E1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  card: {
    shadowColor: '#2F3E1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 3,
  },
  float: {
    shadowColor: '#2F3E1E',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;

export const MaxContentWidth = 720;
