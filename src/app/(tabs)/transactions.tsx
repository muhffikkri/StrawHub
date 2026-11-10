import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Card,
  EmptyState,
  LabelValueRow,
  Screen,
  SectionHeader,
  StatusBadge,
} from '@/components/ui';
import { Fonts, Typography } from '@/constants/theme';
import { activeDeals } from '@/domain/impact';
import { isTerminal } from '@/domain/transactions';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrencyIDR, formatQuantity } from '@/lib/format';
import { useDemo } from '@/store/demo-store';

export default function TransactionsScreen() {
  const { palette } = useAppTheme();
  const { transactions, buyers, residue } = useDemo();

  const active = activeDeals(transactions);
  const finished = transactions.filter((t) => isTerminal(t.status));

  function renderRow(t: (typeof transactions)[number]) {
    const buyer = buyers.find((b) => b.id === t.buyerId);
    const record = residue.find((r) => r.id === t.residueRecordId);
    return (
      <Link
        key={t.id}
        href={{ pathname: '/transaction/[id]', params: { id: t.id } }}
        asChild
      >
        <Card>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: palette.text }]}>
              {buyer?.name ?? 'Buyer'}
            </Text>
            <StatusBadge status={t.status} />
          </View>
          <Text style={[styles.caption, { color: palette.textSecondary }]}>
            {t.id} · {residueLabel(record?.residueType)}
          </Text>
          <LabelValueRow
            label="Offered"
            value={`${formatCurrencyIDR(t.offerPricePerTonne)}/t · ${formatQuantity(
              t.estimatedQuantityTonnes,
            )} est.`}
          />
          {t.measuredQuantityTonnes != null ? (
            <LabelValueRow
              label="Measured"
              value={formatQuantity(t.measuredQuantityTonnes)}
              valueStyle={{ color: palette.accent }}
            />
          ) : null}
        </Card>
      </Link>
    );
  }

  return (
    <Screen title="Transactions" subtitle="Demo offers — no real payments are made">
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          body="Create a demo offer from the Matches tab to follow a transaction through pickup, weighing, and payment."
        />
      ) : (
        <>
          {active.length > 0 ? (
            <>
              <SectionHeader>Active</SectionHeader>
              {active.map(renderRow)}
            </>
          ) : null}
          {finished.length > 0 ? (
            <>
              <SectionHeader>Finished</SectionHeader>
              {finished.map(renderRow)}
            </>
          ) : null}
        </>
      )}

      <SectionHeader>Status meanings</SectionHeader>
      <Card>
        <Text style={[styles.note, { color: palette.textSecondary }]}>
          Draft → Offered → Farmer Accepted → Pickup Scheduled → Collected / Weighed →
          Payment Pending → Completed. Offers can also be rejected, cancelled, or
          disputed. Every change records a timestamp and actor; demo completion never
          implies a real payment.
        </Text>
      </Card>
    </Screen>
  );
}

function residueLabel(type?: string): string {
  switch (type) {
    case 'wheat_straw':
      return 'Wheat straw';
    case 'rice_straw':
      return 'Rice straw';
    case 'corn_stover':
      return 'Corn stover';
    default:
      return 'residue';
  }
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontFamily: Fonts.serif.semibold, fontSize: Typography.body + 2, flex: 1 },
  caption: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption },
  note: { fontFamily: Fonts.sans.regular, fontSize: Typography.body, lineHeight: 19 },
});
