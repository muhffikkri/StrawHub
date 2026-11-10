import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Badge,
  Card,
  KpiCard,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { Typography } from '@/constants/theme';
import { DATASET_METADATA } from '@/data/fixtures';
import { summarizeOperations } from '@/domain/impact';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatQuantity } from '@/lib/format';
import { useDemo } from '@/store/demo-store';

export default function ImpactScreen() {
  const { palette } = useAppTheme();
  const { residue, transactions } = useDemo();
  const summary = summarizeOperations(residue, transactions);

  return (
    <Screen title="Impact & Evidence" subtitle="Operational metrics kept distinct from environmental impact">
      <SectionHeader>Operational metrics</SectionHeader>
      <View style={styles.kpiRow}>
        <KpiCard label="Registered" value={formatQuantity(summary.registeredTonnes)} caption="Farmer estimates" />
        <KpiCard label="Verified" value={formatQuantity(summary.verifiedTonnes)} caption="Field-checked" />
      </View>
      <View style={styles.kpiRow}>
        <KpiCard label="Collected" value={formatQuantity(summary.collectedTonnes)} caption="Weighed at pickup" />
        <KpiCard label="Sold" value={formatQuantity(summary.soldTonnes)} caption="Buyer-accepted" />
      </View>
      <Card>
        <Text style={[styles.body, { color: palette.text }]}>Transactions</Text>
        <Text style={[styles.caption, { color: palette.textSecondary }]}>
          {summary.completedCount} completed of {summary.transactionCount} total
          {summary.completionRate != null
            ? ` · ${(summary.completionRate * 100).toFixed(0)}% of finished deals completed`
            : ''}
        </Text>
      </Card>

      <SectionHeader>Environmental impact</SectionHeader>
      <Card>
        <Badge label="NOT ESTIMATED" tone="warning" />
        <Text style={[styles.body, { color: palette.text, marginTop: 8 }]}>
          Avoided burning and avoided emissions are not estimated.
        </Text>
        <Text style={[styles.caption, { color: palette.textSecondary }]}>
          Collected mass is not automatically diverted mass. Reporting avoided
          emissions requires a documented counterfactual, suitable emission factors,
          clear system boundaries, and an uncertainty range. Until that method exists,
          this app reports operations only — never zero, never a fabricated value.
        </Text>
      </Card>

      <SectionHeader>Data provenance</SectionHeader>
      <Card>
        <Text style={[styles.caption, { color: palette.textSecondary }]}>
          Dataset mode: {DATASET_METADATA.mode} · region: {DATASET_METADATA.region} · as
          of {DATASET_METADATA.asOf}. {DATASET_METADATA.warning}
        </Text>
        <Text style={[styles.caption, { color: palette.textSecondary, marginTop: 8 }]}>
          Labels used throughout: SIMULATED (created for the demo), OBSERVED (collected
          from a real source, not necessarily verified), DERIVED (calculated from other
          data), VERIFIED (reviewed under a documented procedure).
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpiRow: { flexDirection: 'row', gap: 8 },
  body: { fontSize: Typography.body, fontWeight: '600' },
  caption: { fontSize: Typography.caption, lineHeight: 16 },
});
