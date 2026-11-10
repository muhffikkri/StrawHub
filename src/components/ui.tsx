/**
 * Shared UI primitives — AgroTech Precision / AquaCrop design language.
 * Pill touchpoints, organic earth tones, serif headings × sans interface.
 * Status colors are always paired with a text label — color never
 * carries meaning alone. See design.md for the full rules.
 */

import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { Provenance, TransactionStatus, VerificationStatus } from '@/domain/types';
import { TRANSACTION_STATUS_LABELS } from '@/domain/transactions';

/* ---------- Screen ---------- */

export function Screen({
  title,
  subtitle,
  children,
  scroll = true,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  scroll?: boolean;
  actions?: React.ReactNode;
}) {
  const { palette } = useAppTheme();
  const body = scroll ? (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.screenContent}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screenContent, { flex: 1 }]}>{children}</View>
  );
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]} edges={['top']}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: palette.textSecondary }]}>{subtitle}</Text>
          ) : null}
        </View>
        {actions}
      </View>
      <DemoBanner />
      {body}
    </SafeAreaView>
  );
}

/* ---------- Demo banner (coral soft) ---------- */

export function DemoBanner() {
  const { palette } = useAppTheme();
  return (
    <View style={[styles.banner, { backgroundColor: palette.warningMuted }]}>
      <Text style={[styles.bannerText, { color: palette.warning }]}>
        SIMULATED DATA — all records, prices and transactions are illustrative and not
        field-verified.
      </Text>
    </View>
  );
}

/* ---------- Badge — pill system ---------- */

export type BadgeTone = 'accent' | 'info' | 'warning' | 'danger' | 'neutral';

/**
 * Pill badges per the sticker sheet:
 * - accent  → leaf tint, forest text (categorical / rule-based fit)
 * - info    → solid moss, white text (positive, on-track, verified)
 * - warning → coral soft fill, coral text (simulated, caution)
 * - danger  → coral soft fill, coral text (alerts, failed constraints)
 * - neutral → cream inset, soil text (neutral facts)
 */
export function Badge({ label, tone }: { label: string; tone: BadgeTone }) {
  const stylesByTone: Record<BadgeTone, { fg: string; bg: string; solid?: boolean }> = {
    accent: { fg: Colors.forest, bg: '#E5EBD9' },
    info: { fg: '#FFFFFF', bg: Colors.moss, solid: true },
    warning: { fg: Colors.coral, bg: Colors.coralSoft },
    danger: { fg: Colors.coral, bg: Colors.coralSoft },
    neutral: { fg: Colors.soil, bg: Colors.creamDark },
  };
  const t = stylesByTone[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.badgeText, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const PROVENANCE_LABEL: Record<
  Provenance,
  { label: string; tone: BadgeTone }
> = {
  simulated: { label: 'SIMULATED', tone: 'warning' },
  observed: { label: 'OBSERVED', tone: 'neutral' },
  derived: { label: 'DERIVED', tone: 'neutral' },
  verified: { label: 'VERIFIED', tone: 'info' },
};

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const p = PROVENANCE_LABEL[provenance];
  return <Badge label={p.label} tone={p.tone} />;
}

const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  unverified: 'Not yet verified',
  pending: 'Verification pending',
  verified: 'Verified',
  rejected: 'Verification rejected',
  needs_review: 'Needs review',
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const tone: BadgeTone =
    status === 'verified' ? 'info' : status === 'rejected' ? 'danger' : 'warning';
  return <Badge label={VERIFICATION_LABEL[status]} tone={tone} />;
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const tone: BadgeTone =
    status === 'completed'
      ? 'info'
      : status === 'rejected' || status === 'cancelled' || status === 'disputed'
        ? 'danger'
        : status === 'needs_review'
          ? 'warning'
          : 'info';
  return <Badge label={TRANSACTION_STATUS_LABELS[status]} tone={tone} />;
}

/* ---------- Card — telemetry archetype ---------- */

export function Card({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { palette } = useAppTheme();
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
          pressed && { opacity: 0.85 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View
      style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }, style]}
    >
      {children}
    </View>
  );
}

/* ---------- KPI card — serif metric ---------- */

export function KpiCard({
  label,
  value,
  caption,
  badge,
}: {
  label: string;
  value: string;
  caption?: string;
  badge?: React.ReactNode;
}) {
  const { palette } = useAppTheme();
  return (
    <Card style={{ flex: 1 }}>
      <Text style={[styles.kpiLabel, { color: palette.textSecondary }]}>{label}</Text>
      <Text style={[styles.kpiValue, { color: palette.text }]}>{value}</Text>
      {caption ? (
        <Text style={[styles.kpiCaption, { color: palette.textSecondary }]}>{caption}</Text>
      ) : null}
      {badge ? <View style={{ marginTop: Spacing.sm }}>{badge}</View> : null}
    </Card>
  );
}

/* ---------- Row / label helpers ---------- */

export function LabelValueRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: StyleProp<TextStyle>;
}) {
  const { palette } = useAppTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: palette.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: palette.text }, valueStyle]}>{value}</Text>
    </View>
  );
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  const { palette } = useAppTheme();
  return (
    <Text style={[styles.sectionHeader, { color: palette.textSecondary }]}>{children}</Text>
  );
}

/* ---------- Buttons — pill touchpoints ---------- */

/** Dark hero pill — forest fill, white text. */
export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        Shadows.soft,
        {
          backgroundColor: disabled ? Colors.creamDark : pressed ? Colors.forestDark : Colors.forest,
        },
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          { color: disabled ? Colors.hint : '#FFFFFF' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Cream outlined pill — alternative flows. */
export function SecondaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? 'rgba(230,227,216,0.6)' : Colors.cream,
          borderColor: Colors.sand,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={[styles.buttonText, { color: disabled ? Colors.hint : Colors.soil }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Text-only action. */
export function GhostButton({
  label,
  onPress,
  disabled,
  tone = 'neutral',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'neutral' | 'danger' | 'accent';
}) {
  const { palette } = useAppTheme();
  const fg =
    tone === 'danger'
      ? palette.danger
      : tone === 'accent'
        ? palette.accent
        : palette.textSecondary;
  return (
    <Pressable onPress={onPress} disabled={disabled} style={styles.ghostButton}>
      <Text style={[styles.ghostButtonText, { color: disabled ? palette.border : fg }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const { palette } = useAppTheme();
  return (
    <Card style={{ alignItems: 'center', paddingVertical: Spacing.xxl }}>
      <Text style={[styles.emptyTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: palette.textSecondary }]}>{body}</Text>
      {action ? <View style={{ marginTop: Spacing.lg, alignSelf: 'stretch' }}>{action}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  screenContent: { padding: Spacing.lg, gap: Spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  // Serif screen headline (design.md §4 serif scale)
  title: {
    fontFamily: Fonts.serif.medium,
    fontSize: Typography.headline,
    lineHeight: Typography.headline * 1.25,
  },
  subtitle: {
    fontFamily: Fonts.sans.regular,
    fontSize: Typography.caption,
    marginTop: 2,
  },
  banner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  bannerText: {
    fontFamily: Fonts.sans.semibold,
    fontSize: Typography.micro,
    letterSpacing: 0.4,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: Fonts.sans.semibold,
    fontSize: Typography.micro,
    letterSpacing: 0.3,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  kpiLabel: {
    fontFamily: Fonts.sans.semibold,
    fontSize: Typography.micro,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // Serif KPI value with tabular figures
  kpiValue: {
    fontFamily: Fonts.serif.semibold,
    fontSize: Typography.value,
    fontVariant: ['tabular-nums'],
  },
  kpiCaption: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowLabel: { fontFamily: Fonts.sans.regular, fontSize: Typography.body },
  rowValue: {
    fontFamily: Fonts.sans.semibold,
    fontSize: Typography.body,
    textAlign: 'right',
  },
  sectionHeader: {
    fontFamily: Fonts.sans.semibold,
    fontSize: Typography.micro,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  button: {
    borderRadius: Radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: Fonts.sans.medium, fontSize: 15 },
  ghostButton: { paddingVertical: Spacing.sm, alignItems: 'center' },
  ghostButtonText: { fontFamily: Fonts.sans.semibold, fontSize: Typography.body },
  emptyTitle: {
    fontFamily: Fonts.serif.semibold,
    fontSize: Typography.title,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: Fonts.sans.regular,
    fontSize: Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
});
