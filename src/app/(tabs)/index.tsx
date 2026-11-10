import { Link, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  GhostButton,
  KpiCard,
  PrimaryButton,
  ProvenanceBadge,
  Screen,
  SectionHeader,
  StatusBadge,
  VerificationBadge,
} from '@/components/ui';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import { DEMO_FARMER } from '@/data/fixtures';
import { activeDeals, summarizeOperations } from '@/domain/impact';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatQuantity } from '@/lib/format';
import { useDemo } from '@/store/demo-store';

export default function HomeScreen() {
  const { palette } = useAppTheme();
  const { residue, transactions, buyers, reset } = useDemo();

  const summary = summarizeOperations(residue, transactions);
  const active = activeDeals(transactions);

  return (
    <Screen title="StrawHub" subtitle="Jerami Jadi Rupiah">
      <Card>
        <View style={styles.profileRow}>
          <View>
            <Text style={[styles.profileName, { color: palette.text }]}>
              {DEMO_FARMER.name}
            </Text>
            <Text style={[styles.profileZone, { color: palette.textSecondary }]}>
              {DEMO_FARMER.zone} · demo profile
            </Text>
          </View>
        </View>
      </Card>

      <PrimaryButton label="Register residue" onPress={() => router.push('/register')} />

      <SectionHeader>Overview</SectionHeader>
      <View style={styles.kpiRow}>
        <KpiCard
          label="Registered"
          value={formatQuantity(summary.registeredTonnes)}
          caption="Estimated available residue"
        />
        <KpiCard
          label="Active deals"
          value={String(active.length)}
          caption="Offers in progress"
        />
        <KpiCard
          label="Sold"
          value={formatQuantity(summary.soldTonnes)}
          caption="Buyer-accepted, completed"
        />
      </View>

      <SectionHeader>Registered residue</SectionHeader>
      {residue.length === 0 ? (
        <EmptyState
          title="Nothing registered yet"
          body="Register your straw to see buyer candidates and indicative prices."
          action={
            <PrimaryButton label="Register residue" onPress={() => router.push('/register')} />
          }
        />
      ) : (
        residue.slice(0, 3).map((record) => (
          <Link key={record.id} href={{ pathname: '/matches', params: { recordId: record.id } }} asChild>
            <Card>
              <View style={styles.cardTitleRow}>
                <Text style={[styles.cardTitle, { color: palette.text }]}>
                  {residueLabel(record.residueType)} · {formatQuantity(record.estimatedQuantityTonnes)}
                </Text>
                <ProvenanceBadge provenance={record.provenance} />
              </View>
              <Text style={[styles.cardCaption, { color: palette.textSecondary }]}>
                {record.estimateMethod} · available until {record.availableUntil}
              </Text>
              <VerificationBadge status={record.verificationStatus} />
            </Card>
          </Link>
        ))
      )}
      <GhostButton
        label="See full registry →"
        tone="accent"
        onPress={() => router.push('/(tabs)/registry')}
      />

      <SectionHeader>Active transactions</SectionHeader>
      {active.length === 0 ? (
        <EmptyState
          title="No active deals"
          body="Accepted matches appear here through pickup, weighing, and payment."
        />
      ) : (
        active.map((t) => {
          const buyer = buyers.find((b) => b.id === t.buyerId);
          return (
            <Link key={t.id} href={{ pathname: `/transaction/${t.id}` }} asChild>
              <Card>
                <View style={styles.cardTitleRow}>
                  <Text style={[styles.cardTitle, { color: palette.text }]}>
                    {buyer?.name ?? 'Buyer'}
                  </Text>
                  <StatusBadge status={t.status} />
                </View>
                <Text style={[styles.cardCaption, { color: palette.textSecondary }]}>
                  {formatQuantity(t.estimatedQuantityTonnes)} estimated
                  {t.measuredQuantityTonnes != null
                    ? ` · ${formatQuantity(t.measuredQuantityTonnes)} measured`
                    : ''}
                </Text>
              </Card>
            </Link>
          );
        })
      )}

      <SectionHeader>Impact</SectionHeader>
      <Card>
        <Text style={[styles.impactBody, { color: palette.textSecondary }]}>
          Operational metrics are tracked separately from environmental impact. Avoided
          burning and emissions are not estimated until a documented counterfactual
          exists.
        </Text>
        <PrimaryButton label="View Impact & Evidence" onPress={() => router.push('/impact')} />
      </Card>

      <GhostButton label="Reset demo data" tone="danger" onPress={reset} />
    </Screen>
  );
}

function residueLabel(type: string): string {
  switch (type) {
    case 'wheat_straw':
      return 'Wheat straw';
    case 'rice_straw':
      return 'Rice straw';
    case 'corn_stover':
      return 'Corn stover';
    default:
      return type;
  }
}

const styles = StyleSheet.create({
  profileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileName: { fontFamily: Fonts.serif.semibold, fontSize: Typography.title },
  profileZone: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption, marginTop: 2 },
  kpiRow: { flexDirection: 'row', gap: Spacing.sm },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: { fontFamily: Fonts.serif.semibold, fontSize: Typography.body + 2, flex: 1 },
  cardCaption: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption },
  impactBody: { fontFamily: Fonts.sans.regular, fontSize: Typography.body, lineHeight: 19 },
});
