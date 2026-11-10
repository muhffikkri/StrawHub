import { Link, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  LabelValueRow,
  PrimaryButton,
  ProvenanceBadge,
  Screen,
  SectionHeader,
  VerificationBadge,
} from '@/components/ui';
import { Fonts, Typography } from '@/constants/theme';
import type { ResidueRecord } from '@/domain/types';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDate, formatQuantity } from '@/lib/format';
import { useDemo } from '@/store/demo-store';

export default function RegistryScreen() {
  const { palette } = useAppTheme();
  const { residue } = useDemo();

  return (
    <Screen title="Residue Registry" subtitle="Estimated available residue per record">
      <PrimaryButton label="Register new residue" onPress={() => router.push('/register')} />

      {residue.length === 0 ? (
        <EmptyState
          title="Nothing registered yet"
          body="Registered supply is an estimate until verified in the field — it is never shown as collected supply."
          action={
            <PrimaryButton label="Register residue" onPress={() => router.push('/register')} />
          }
        />
      ) : (
        residue.map((record) => (
          <Link
            key={record.id}
            href={{ pathname: '/matches', params: { recordId: record.id } }}
            asChild
          >
            <Card>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: palette.text }]}>
                  {residueLabel(record.residueType)}
                </Text>
                <ProvenanceBadge provenance={record.provenance} />
              </View>
              <LabelValueRow
                label="Estimated quantity"
                value={formatQuantity(record.estimatedQuantityTonnes)}
              />
              <LabelValueRow
                label="Field area"
                value={`${record.fieldAreaValue} ${record.fieldAreaUnit}`}
              />
              <LabelValueRow label="Harvested" value={formatDate(record.harvestDate)} />
              <LabelValueRow
                label="Available"
                value={`${formatDate(record.availableFrom)} – ${formatDate(record.availableUntil)}`}
              />
              <LabelValueRow
                label="Condition"
                value={conditionLabel(record.condition, record.handlingForm)}
              />
              <Text style={[styles.methodNote, { color: palette.textSecondary }]}>
                Estimate method: {record.estimateMethod}. A photograph or field-area
                estimate is never treated as a measured weight.
              </Text>
              <VerificationBadge status={record.verificationStatus} />
            </Card>
          </Link>
        ))
      )}

      <SectionHeader>What “registered” means</SectionHeader>
      <Card>
        <Text style={[styles.note, { color: palette.textSecondary }]}>
          Registered quantity is a farmer estimate. Verified quantity is confirmed by a
          field check. Measured quantity is recorded at the weighbridge during
          collection. These three numbers are always kept separate.
        </Text>
      </Card>
    </Screen>
  );
}

function residueLabel(type: ResidueRecord['residueType']): string {
  switch (type) {
    case 'wheat_straw':
      return 'Wheat straw';
    case 'rice_straw':
      return 'Rice straw';
    case 'corn_stover':
      return 'Corn stover';
  }
}

function conditionLabel(
  condition: ResidueRecord['condition'],
  form: ResidueRecord['handlingForm'],
): string {
  const c = condition === 'dry' ? 'Dry' : condition === 'partly_dry' ? 'Partly dry' : 'Wet';
  const f = form === 'baled' ? 'baled' : form === 'loose' ? 'loose' : 'chopped';
  return `${c}, ${f}`;
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: { fontFamily: Fonts.serif.semibold, fontSize: Typography.body + 2, flex: 1 },
  methodNote: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption, lineHeight: 16 },
  note: { fontFamily: Fonts.sans.regular, fontSize: Typography.body, lineHeight: 19 },
});
