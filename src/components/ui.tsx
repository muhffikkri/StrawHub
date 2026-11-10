/**
 * Shared UI primitives.
 * Status colors are always paired with a text label — color never
 * carries meaning alone.
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

import { Radius, Spacing, Typography } from '@/constants/theme';
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

/* ---------- Demo banner ---------- */

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

/* ---------- Badge ---------- */

export function Badge({
  label,
  tone,
}: {
  label: string;
  tone: 'accent' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  const { palette } = useAppTheme();
  const tones: Record<string, { fg: string; bg: string }> = {
    accent: { fg: palette.accent, bg: palette.accentMuted },
    warning: { fg: palette.warning, bg: palette.warningMuted },
    danger: { fg: palette.danger, bg: palette.dangerMuted },
    info: { fg: palette.info, bg: palette.infoMuted },
    neutral: { fg: palette.textSecondary, bg: palette.surfaceMuted },
  };
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.badgeText, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const PROVENANCE_LABEL: Record<Provenance, { label: string; tone: 'accent' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  simulated: { label: 'SIMULATED', tone: 'warning' },
  observed: { label: 'OBSERVED', tone: 'info' },
  derived: { label: 'DERIVED', tone: 'neutral' },
  verified: { label: 'VERIFIED', tone: 'accent' },
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
  const tone =
    status === 'verified' ? 'accent' : status === 'rejected' ? 'danger' : 'warning';
  return <Badge label={VERIFICATION_LABEL[status]} tone={tone} />;
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const tone =
    status === 'completed'
      ? 'accent'
      : status === 'rejected' || status === 'cancelled' || status === 'disputed'
        ? 'danger'
        : status === 'needs_review'
          ? 'warning'
          : 'info';
  return <Badge label={TRANSACTION_STATUS_LABELS[status]} tone={tone} />;
}

/* ---------- Card ---------- */

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
          pressed && { opacity: 0.8 },
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

/* ---------- KPI ---------- */

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

/* ---------- Button ---------- */

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'accent',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'accent' | 'neutral' | 'danger';
}) {
  const { palette } = useAppTheme();
  const bg =
    tone === 'accent'
      ? palette.accent
      : tone === 'danger'
        ? palette.danger
        : palette.surfaceMuted;
  const fg = tone === 'neutral' ? palette.text : '#FFFFFF';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: disabled ? palette.surfaceMuted : bg },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.buttonText, { color: disabled ? palette.textSecondary : fg }]}>
        {label}
      </Text>
    </Pressable>
  );
}

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
  const fg = tone === 'danger' ? palette.danger : tone === 'accent' ? palette.accent : palette.textSecondary;
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
  title: { fontSize: Typography.title, fontWeight: '700' },
  subtitle: { fontSize: Typography.caption, marginTop: 2 },
  banner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  bannerText: { fontSize: Typography.micro, fontWeight: '600', letterSpacing: 0.4 },
  badge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: Typography.micro, fontWeight: '700', letterSpacing: 0.4 },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  kpiLabel: { fontSize: Typography.micro, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  kpiValue: { fontSize: Typography.heading + 2, fontWeight: '700' },
  kpiCaption: { fontSize: Typography.caption },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rowLabel: { fontSize: Typography.body },
  rowValue: { fontSize: Typography.body, fontWeight: '600', textAlign: 'right' },
  sectionHeader: {
    fontSize: Typography.micro,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  button: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: Typography.body, fontWeight: '700' },
  ghostButton: { paddingVertical: Spacing.sm, alignItems: 'center' },
  ghostButtonText: { fontSize: Typography.body, fontWeight: '600' },
  emptyTitle: { fontSize: Typography.heading, fontWeight: '700', textAlign: 'center' },
  emptyBody: { fontSize: Typography.body, textAlign: 'center', marginTop: Spacing.xs },
});
