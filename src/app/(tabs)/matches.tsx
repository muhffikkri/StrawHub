import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  Badge,
  Card,
  EmptyState,
  LabelValueRow,
  PrimaryButton,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import { findMatches } from '@/domain/matching';
import type { ResidueRecord } from '@/domain/types';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrencyIDR, formatQuantity } from '@/lib/format';
import { useDemo } from '@/store/demo-store';

export default function MatchesScreen() {
  const { palette, brand } = useAppTheme();
  const { residue, buyers, createOffer } = useDemo();
  const params = useLocalSearchParams<{ recordId?: string }>();

  // The URL is the single source of truth for the selected record.
  const recordIdParam = typeof params.recordId === 'string' ? params.recordId : null;
  const selectedId = recordIdParam ?? residue[0]?.id ?? null;

  const record = residue.find((r) => r.id === selectedId) ?? residue[0] ?? null;
  const matches = useMemo(
    () => (record ? findMatches(record, buyers) : []),
    [record, buyers],
  );
  const eligible = matches.filter((m) => m.eligibility === 'eligible');

  if (residue.length === 0) {
    return (
      <Screen title="Buyer Matching" subtitle="Rule-based fit, never a forced match">
        <EmptyState
          title="Nothing to match yet"
          body="Register residue first — matches are evaluated against buyer requirements."
        />
      </Screen>
    );
  }

  function handleCreateOffer(buyerId: string, pricePerTonne: number) {
    if (!record) return;
    createOffer({
      residueRecordId: record.id,
      buyerId,
      offerPricePerTonne: pricePerTonne,
      estimatedQuantityTonnes: record.estimatedQuantityTonnes,
    });
  }

  return (
    <Screen
      title="Buyer Matching"
      subtitle={`Rule-based fit for ${record ? formatQuantity(record.estimatedQuantityTonnes) : '—'}`}
    >
      <SectionHeader>Select residue record</SectionHeader>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.sm }}
      >
        {residue.map((r) => {
          const active = r.id === record?.id;
          return (
            <Pressable
              key={r.id}
              onPress={() => router.setParams({ recordId: r.id })}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? palette.accent : palette.surface,
                  borderColor: active ? palette.accent : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: active ? '#FFFFFF' : palette.textSecondary },
                ]}
              >
                {residueLabel(r.residueType)} {formatQuantity(r.estimatedQuantityTonnes)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {eligible.length === 0 ? (
        <Card>
          <Badge label="NO VIABLE MATCH" tone="danger" />
          <Text style={[styles.noMatchTitle, { color: palette.text }]}>
            No buyer fits this record
          </Text>
          <Text style={[styles.noMatchBody, { color: palette.textSecondary }]}>
            Each candidate below failed at least one hard constraint. A no-match result
            is a valid outcome — matches are never forced.
          </Text>
        </Card>
      ) : null}

      {matches.map(({ buyer, eligibility, blockers, economics }) => (
        <Card key={buyer.id}>
          <View style={styles.titleRow}>
            <Text style={[styles.buyerName, { color: palette.text }]}>{buyer.name}</Text>
            <Badge
              label={eligibility === 'eligible' ? 'RULE-BASED FIT' : 'NOT ELIGIBLE'}
              tone={eligibility === 'eligible' ? 'accent' : 'danger'}
            />
          </View>
          <Text style={[styles.buyerType, { color: palette.textSecondary }]}>
            {buyerTypeLabel(buyer.buyerType)} · {buyer.location} · {buyer.distanceKm} km
          </Text>

          {blockers.length > 0 ? (
            <View style={styles.blockerBox}>
              {blockers.map((b) => (
                <Text key={b.code} style={[styles.blocker, { color: palette.danger }]}>
                  ✕ {b.reason}
                </Text>
              ))}
            </View>
          ) : null}

          {eligibility === 'eligible' ? (
            <>
              <LabelValueRow
                label={`Indicative price (${priceBasisLabel(buyer.requirement.priceBasis)})`}
                value={formatCurrencyIDR(buyer.requirement.pricePerTonne) + '/t'}
              />
              <LabelValueRow label="Gross value" value={formatCurrencyIDR(economics.grossValue)} />
              <LabelValueRow
                label="− Transport, loading, baling"
                value={formatCurrencyIDR(economics.totalKnownCosts)}
                valueStyle={{ color: palette.danger }}
              />
              <LabelValueRow
                label="Indicative net proceeds"
                value={formatCurrencyIDR(economics.indicativeNetProceeds)}
                valueStyle={{
                  color:
                    economics.indicativeNetProceeds < 0 ? palette.danger : brand.moss,
                }}
              />
              <Text style={[styles.assumption, { color: palette.textSecondary }]}>
                Net proceeds is indicative — missing costs would reduce it. It is not a
                guaranteed price or profit. Quote valid until{' '}
                {buyer.requirement.validUntil}.
              </Text>
              <PrimaryButton
                label="Create demo offer"
                onPress={() => handleCreateOffer(buyer.id, buyer.requirement.pricePerTonne)}
              />
            </>
          ) : null}
        </Card>
      ))}

      <SectionHeader>How matching works</SectionHeader>
      <Card>
        <Text style={[styles.note, { color: palette.textSecondary }]}>
          Eligibility applies hard constraints first: residue type, condition, handling
          form, volume limits, availability window, and quote validity. Ranking by net
          proceeds never overrides a failed constraint.
        </Text>
      </Card>
    </Screen>
  );
}

function residueLabel(type: ResidueRecord['residueType']): string {
  switch (type) {
    case 'wheat_straw':
      return 'Wheat';
    case 'rice_straw':
      return 'Rice';
    case 'corn_stover':
      return 'Corn';
  }
}

function buyerTypeLabel(type: string): string {
  switch (type) {
    case 'local_fodder':
      return 'Local fodder buyer';
    case 'aggregator':
      return 'Aggregator';
    case 'biomass_processor':
      return 'Biomass processor';
    case 'industrial_user':
      return 'Industrial user';
    default:
      return type;
  }
}

function priceBasisLabel(basis: string): string {
  switch (basis) {
    case 'farm_gate':
      return 'farm-gate';
    case 'delivered':
      return 'delivered';
    default:
      return 'unknown basis';
  }
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  chipText: { fontFamily: Fonts.sans.semibold, fontSize: Typography.caption },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buyerName: { fontFamily: Fonts.serif.semibold, fontSize: Typography.body + 2, flex: 1 },
  buyerType: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption },
  blockerBox: { gap: 2, marginTop: Spacing.xs },
  blocker: { fontFamily: Fonts.sans.semibold, fontSize: Typography.caption },
  noMatchTitle: {
    fontFamily: Fonts.serif.semibold,
    fontSize: Typography.subtitle,
    marginTop: Spacing.xs,
  },
  noMatchBody: { fontFamily: Fonts.sans.regular, fontSize: Typography.body, lineHeight: 19, marginTop: Spacing.xs },
  assumption: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption, lineHeight: 16 },
  note: { fontFamily: Fonts.sans.regular, fontSize: Typography.body, lineHeight: 19 },
});
