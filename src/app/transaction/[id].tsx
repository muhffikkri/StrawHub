import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  Card,
  EmptyState,
  GhostButton,
  LabelValueRow,
  PrimaryButton,
  Screen,
  SectionHeader,
  StatusBadge,
} from '@/components/ui';
import { Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import { nextStatuses, TRANSACTION_STATUS_LABELS } from '@/domain/transactions';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrencyIDR, formatDate, formatQuantity } from '@/lib/format';
import { useDemo } from '@/store/demo-store';

export default function TransactionDetailScreen() {
  const { palette } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions, events, buyers, residue, transition, recordMeasurement } =
    useDemo();
  const [weightInput, setWeightInput] = useState('');

  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) {
    return (
      <Screen title="Transaction" subtitle="Not found">
        <EmptyState
          title="Transaction not found"
          body="This demo record no longer exists. Reset demo data from Home to restore fixtures."
        />
      </Screen>
    );
  }

  const buyer = buyers.find((b) => b.id === transaction.buyerId);
  const record = residue.find((r) => r.id === transaction.residueRecordId);
  const timeline = events
    .filter((e) => e.transactionId === transaction.id)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const allowed = nextStatuses(transaction.status);
  const canWeigh =
    transaction.status === 'collected_weighed' || transaction.measuredQuantityTonnes != null;

  const inputStyle = [
    styles.input,
    { color: palette.text, backgroundColor: palette.surfaceMuted, borderColor: palette.border },
  ];

  return (
    <Screen title={buyer?.name ?? 'Transaction'} subtitle={transaction.id} scroll={false}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}
      >
        <Card>
          <View style={styles.statusRow}>
            <StatusBadge status={transaction.status} />
            <Text style={[styles.demoNote, { color: palette.textSecondary }]}>
              Demo transaction — no real payment
            </Text>
          </View>
          <LabelValueRow
            label="Offered price"
            value={`${formatCurrencyIDR(transaction.offerPricePerTonne)}/t`}
          />
          <LabelValueRow
            label="Estimated quantity"
            value={formatQuantity(transaction.estimatedQuantityTonnes)}
          />
          {transaction.measuredQuantityTonnes != null ? (
            <LabelValueRow
              label="Measured quantity"
              value={formatQuantity(transaction.measuredQuantityTonnes)}
              valueStyle={{ color: palette.accent }}
            />
          ) : null}
          {transaction.acceptedQuantityTonnes != null ? (
            <LabelValueRow
              label="Buyer-accepted quantity"
              value={formatQuantity(transaction.acceptedQuantityTonnes)}
            />
          ) : null}
          {record ? (
            <LabelValueRow
              label="Residue"
              value={`${record.residueType.replace('_', ' ')} · ${record.estimateMethod}`}
            />
          ) : null}
          {transaction.pickupScheduledAt ? (
            <LabelValueRow label="Pickup scheduled" value={formatDate(transaction.pickupScheduledAt.slice(0, 10))} />
          ) : null}
        </Card>

        {(transaction.status === 'pickup_scheduled' ||
          transaction.status === 'collected_weighed') &&
        transaction.measuredQuantityTonnes == null ? (
          <Card>
            <SectionHeader>Record measured weight</SectionHeader>
            <TextInput
              style={inputStyle}
              value={weightInput}
              onChangeText={setWeightInput}
              placeholder="Weighbridge reading in tonnes"
              placeholderTextColor={palette.textSecondary}
              keyboardType="decimal-pad"
              accessibilityLabel="Measured weight in tonnes"
            />
            <Text style={[styles.note, { color: palette.textSecondary }]}>
              The measured weight is stored separately from the estimate. It never
              overwrites the original estimate.
            </Text>
            <PrimaryButton
              label="Save measured weight"
              disabled={
                !weightInput || Number(weightInput) <= 0 || !Number.isFinite(Number(weightInput))
              }
              onPress={() => {
                recordMeasurement(transaction.id, Number(weightInput));
                setWeightInput('');
              }}
            />
          </Card>
        ) : null}

        {canWeigh ? (
          <Card>
            <SectionHeader>Estimate vs measurement</SectionHeader>
            <Text style={[styles.note, { color: palette.textSecondary }]}>
              Estimated {formatQuantity(transaction.estimatedQuantityTonnes)} · measured{' '}
              {transaction.measuredQuantityTonnes != null
                ? formatQuantity(transaction.measuredQuantityTonnes)
                : 'not recorded yet'}
              . The difference feeds the pilot evaluation metric “difference between
              estimated and measured quantities.”
            </Text>
          </Card>
        ) : null}

        <SectionHeader>Event timeline</SectionHeader>
        {timeline.length === 0 ? (
          <Card>
            <Text style={[styles.note, { color: palette.textSecondary }]}>
              No events recorded yet.
            </Text>
          </Card>
        ) : (
          timeline.map((event) => (
            <Card key={event.id}>
              <View style={styles.statusRow}>
                <Text style={[styles.eventTitle, { color: palette.text }]}>
                  {TRANSACTION_STATUS_LABELS[event.toStatus]}
                  {event.fromStatus && event.fromStatus !== event.toStatus
                    ? ` ← ${TRANSACTION_STATUS_LABELS[event.fromStatus]}`
                    : ''}
                </Text>
                <Text style={[styles.eventDate, { color: palette.textSecondary }]}>
                  {formatDate(event.occurredAt.slice(0, 10))}
                </Text>
              </View>
              <Text style={[styles.note, { color: palette.textSecondary }]}>
                {event.actor}
                {event.note ? ` — ${event.note}` : ''}
              </Text>
            </Card>
          ))
        )}

        <SectionHeader>Move to next status</SectionHeader>
        {allowed.length === 0 ? (
          <Card>
            <Text style={[styles.note, { color: palette.textSecondary }]}>
              This transaction is finished. Only allowed transitions are offered —
              the state machine cannot be bypassed.
            </Text>
          </Card>
        ) : (
          <View style={{ gap: Spacing.sm }}>
            {allowed.map((next) => (
              <GhostButton
                key={next}
                label={`Mark as ${TRANSACTION_STATUS_LABELS[next]}`}
                tone={next === 'rejected' || next === 'cancelled' ? 'danger' : 'accent'}
                onPress={() => transition(transaction.id, next)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  demoNote: { fontFamily: Fonts.sans.semibold, fontSize: Typography.micro, textAlign: 'right' },
  input: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.body,
    fontFamily: Fonts.sans.regular,
  },
  note: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption, lineHeight: 16 },
  eventTitle: { fontFamily: Fonts.serif.semibold, fontSize: Typography.body, flex: 1 },
  eventDate: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption },
});
