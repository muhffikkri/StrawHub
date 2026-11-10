import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {
  Card,
  GhostButton,
  PrimaryButton,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/store/auth-store';

import { DEMO_FARMER } from '@/data/fixtures';
import type {
  HandlingForm,
  ResidueCondition,
  ResidueType,
} from '@/domain/types';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatQuantity } from '@/lib/format';
import { useDemo } from '@/store/demo-store';

/**
 * Registration wizard — three short steps, each fitting one screen.
 * Quantity is auto-estimated from field area with a visible assumption;
 * the farmer can override it. Every estimate stays labeled as an estimate.
 */

const RESIDUE_TYPES: { value: ResidueType; label: string; yieldPerHectare: number }[] = [
  { value: 'rice_straw', label: 'Rice straw', yieldPerHectare: 5 },
  { value: 'wheat_straw', label: 'Wheat straw', yieldPerHectare: 4 },
  { value: 'corn_stover', label: 'Corn stover', yieldPerHectare: 4 },
];

const CONDITIONS: { value: ResidueCondition; label: string }[] = [
  { value: 'dry', label: 'Dry' },
  { value: 'partly_dry', label: 'Partly dry' },
  { value: 'wet', label: 'Wet' },
];

const FORMS: { value: HandlingForm; label: string }[] = [
  { value: 'loose', label: 'Loose' },
  { value: 'baled', label: 'Baled' },
  { value: 'chopped', label: 'Chopped' },
];

function isValidISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime());
}

export default function RegisterScreen() {
  const { palette } = useAppTheme();
  const { addResidue } = useDemo();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  const [residueType, setResidueType] = useState<ResidueType>('rice_straw');
  const [fieldAreaValue, setFieldAreaValue] = useState('');
  const [fieldAreaUnit, setFieldAreaUnit] = useState<'acre' | 'hectare'>('hectare');
  const [harvestDate, setHarvestDate] = useState('');
  const [condition, setCondition] = useState<ResidueCondition>('dry');
  const [handlingForm, setHandlingForm] = useState<HandlingForm>('loose');

  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');

  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const typeInfo = RESIDUE_TYPES.find((t) => t.value === residueType)!;
  const areaHectares =
    fieldAreaUnit === 'acre'
      ? Number(fieldAreaValue || 0) * 0.4047
      : Number(fieldAreaValue || 0);

  const suggestedQuantity = useMemo(
    () => Number((areaHectares * typeInfo.yieldPerHectare).toFixed(1)),
    [areaHectares, typeInfo],
  );

  function validateStep(current: number): string[] {
    const found: string[] = [];
    if (current === 1) {
      if (!fieldAreaValue || Number(fieldAreaValue) <= 0 || !Number.isFinite(Number(fieldAreaValue))) {
        found.push('Enter a field area greater than zero.');
      }
      if (!isValidISODate(harvestDate)) {
        found.push('Enter the harvest date as YYYY-MM-DD.');
      }
    }
    if (current === 2) {
      if (
        !estimatedQuantity ||
        Number(estimatedQuantity) <= 0 ||
        !Number.isFinite(Number(estimatedQuantity))
      ) {
        found.push('Enter an estimated quantity greater than zero tonnes.');
      }
      if (!isValidISODate(availableFrom) || !isValidISODate(availableUntil)) {
        found.push('Enter availability dates as YYYY-MM-DD.');
      } else if (availableUntil < availableFrom) {
        found.push('Availability end date must not be before the start date.');
      }
    }
    return found;
  }

  function next() {
    const found = validateStep(step);
    setErrors(found);
    if (found.length === 0) setStep(step + 1);
  }

  function submit() {
    const allErrors = [...validateStep(1), ...validateStep(2)];
    if (allErrors.length > 0) {
      setErrors(allErrors);
      setStep(1);
      return;
    }
    addResidue({
      farmerName: user?.displayName || DEMO_FARMER.name,
      zone: DEMO_FARMER.zone,
      residueType,
      fieldAreaValue: Number(fieldAreaValue),
      fieldAreaUnit,
      harvestDate,
      condition,
      handlingForm,
      estimatedQuantityTonnes: Number(estimatedQuantity),
      estimateMethod: `Field-area estimate (${typeInfo.yieldPerHectare} t/ha assumption, editable)`,
      availableFrom,
      availableUntil,
      photoCount: 0,
      verificationStatus: 'unverified',
      provenance: 'simulated',
    });
    setSubmitted(true);
    // The newest record is prepended, so Matches auto-selects it.
    router.replace('/matches');
  }

  const inputStyle = [
    styles.input,
    {
      color: palette.text,
      backgroundColor: palette.surfaceMuted,
      borderColor: palette.border,
    },
  ];

  return (
    <Screen
      title="Register Residue"
      subtitle={`Step ${step} of 3 — ${step === 1 ? 'crop & field' : step === 2 ? 'quantity & timing' : 'review'}`}
      scroll={false}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}
      >
        {step === 1 ? (
          <>
            <SectionHeader>Residue type</SectionHeader>
            <View style={styles.chipWrap}>
              {RESIDUE_TYPES.map((t) => (
                <ChoiceChip
                  key={t.value}
                  label={t.label}
                  active={residueType === t.value}
                  onPress={() => setResidueType(t.value)}
                />
              ))}
            </View>

            <SectionHeader>Field area</SectionHeader>
            <View style={styles.inputRow}>
              <TextInput
                style={[inputStyle, styles.areaInput]}
                value={fieldAreaValue}
                onChangeText={setFieldAreaValue}
                placeholder="e.g. 2.5"
                placeholderTextColor={palette.textSecondary}
                keyboardType="decimal-pad"
                accessibilityLabel="Field area value"
              />
              <View style={styles.chipWrap}>
                {(['hectare', 'acre'] as const).map((unit) => (
                  <ChoiceChip
                    key={unit}
                    label={unit === 'hectare' ? 'hectare' : 'acre'}
                    active={fieldAreaUnit === unit}
                    onPress={() => setFieldAreaUnit(unit)}
                  />
                ))}
              </View>
            </View>

            <SectionHeader>Harvest date</SectionHeader>
            <TextInput
              style={inputStyle}
              value={harvestDate}
              onChangeText={setHarvestDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={palette.textSecondary}
              keyboardType="numbers-and-punctuation"
              accessibilityLabel="Harvest date"
            />

            <SectionHeader>Condition</SectionHeader>
            <View style={styles.chipWrap}>
              {CONDITIONS.map((c) => (
                <ChoiceChip
                  key={c.value}
                  label={c.label}
                  active={condition === c.value}
                  onPress={() => setCondition(c.value)}
                />
              ))}
            </View>

            <SectionHeader>Handling form</SectionHeader>
            <View style={styles.chipWrap}>
              {FORMS.map((f) => (
                <ChoiceChip
                  key={f.value}
                  label={f.label}
                  active={handlingForm === f.value}
                  onPress={() => setHandlingForm(f.value)}
                />
              ))}
            </View>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <SectionHeader>Estimated quantity</SectionHeader>
            <TextInput
              style={inputStyle}
              value={estimatedQuantity}
              onChangeText={setEstimatedQuantity}
              placeholder={`${suggestedQuantity}`}
              placeholderTextColor={palette.textSecondary}
              keyboardType="decimal-pad"
              accessibilityLabel="Estimated quantity in tonnes"
            />
            <Card>
              <Text style={[styles.autoNote, { color: palette.textSecondary }]}>
                Auto-estimate from field area: {formatQuantity(suggestedQuantity)} ({fieldAreaValue}{' '}
                {fieldAreaUnit} × {typeInfo.yieldPerHectare} t/ha). Edit if you know your
                actual residue. This stays an estimate — it is not a measured weight.
              </Text>
              {suggestedQuantity > 0 && !estimatedQuantity ? (
                <GhostButton
                  label={`Use ${formatQuantity(suggestedQuantity)}`}
                  tone="accent"
                  onPress={() => setEstimatedQuantity(String(suggestedQuantity))}
                />
              ) : null}
            </Card>

            <SectionHeader>Available from</SectionHeader>
            <TextInput
              style={inputStyle}
              value={availableFrom}
              onChangeText={setAvailableFrom}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={palette.textSecondary}
              keyboardType="numbers-and-punctuation"
              accessibilityLabel="Available from date"
            />

            <SectionHeader>Available until</SectionHeader>
            <TextInput
              style={inputStyle}
              value={availableUntil}
              onChangeText={setAvailableUntil}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={palette.textSecondary}
              keyboardType="numbers-and-punctuation"
              accessibilityLabel="Available until date"
            />
            <Card>
              <Text style={[styles.autoNote, { color: palette.textSecondary }]}>
                Buyers need a realistic window: straw usually must be collected within
                weeks of harvest, before the next planting.
              </Text>
            </Card>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <SectionHeader>Review</SectionHeader>
            <Card>
              <ReviewRow label="Residue" value={typeInfo.label} />
              <ReviewRow label="Field area" value={`${fieldAreaValue} ${fieldAreaUnit}`} />
              <ReviewRow label="Harvested" value={harvestDate} />
              <ReviewRow label="Condition" value={condition + ', ' + handlingForm} />
              <ReviewRow label="Estimated quantity" value={formatQuantity(Number(estimatedQuantity))} />
              <ReviewRow label="Available" value={`${availableFrom} to ${availableUntil}`} />
            </Card>
            <Card>
              <Text style={[styles.autoNote, { color: palette.textSecondary }]}>
                By submitting you confirm the estimate reflects your field as best you
                can. Verification happens later in the field; measured weight is
                recorded separately at collection.
              </Text>
            </Card>
          </>
        ) : null}

        {errors.length > 0 ? (
          <View style={[styles.errorBox, { backgroundColor: palette.dangerMuted }]}>
            {errors.map((e) => (
              <Text key={e} style={[styles.errorText, { color: palette.danger }]}>
                • {e}
              </Text>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[styles.footer, { backgroundColor: palette.background, borderTopColor: palette.border }]}
      >
        {step > 1 ? (
          <GhostButton label="Back" onPress={() => setStep(step - 1)} />
        ) : (
          <GhostButton label="Cancel" onPress={() => router.back()} />
        )}
        {step < 3 ? (
          <View style={{ flex: 1 }}>
            <PrimaryButton label="Continue" onPress={next} />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <PrimaryButton label={submitted ? 'Registered' : 'Register residue'} onPress={submit} />
          </View>
        )}
      </View>
    </Screen>
  );

  function ChoiceChip({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={[
          styles.chip,
          {
            backgroundColor: active ? palette.accent : palette.surface,
            borderColor: active ? palette.accent : palette.border,
          },
        ]}
      >
        <Text
          style={[styles.chipText, { color: active ? '#FFFFFF' : palette.textSecondary }]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  function ReviewRow({ label, value }: { label: string; value: string }) {
    return (
      <View style={styles.reviewRow}>
        <Text style={[styles.reviewLabel, { color: palette.textSecondary }]}>{label}</Text>
        <Text style={[styles.reviewValue, { color: palette.text }]}>{value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  chipText: { fontFamily: Fonts.sans.semibold, fontSize: Typography.caption },
  input: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    fontSize: Typography.body,
    fontFamily: Fonts.sans.regular,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  areaInput: { flex: 1 },
  autoNote: { fontFamily: Fonts.sans.regular, fontSize: Typography.caption, lineHeight: 16 },
  errorBox: { borderRadius: Radius.md, padding: Spacing.md, gap: 2 },
  errorText: { fontFamily: Fonts.sans.semibold, fontSize: Typography.caption },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: 2,
  },
  reviewLabel: { fontFamily: Fonts.sans.regular, fontSize: Typography.body },
  reviewValue: {
    fontFamily: Fonts.serif.medium,
    fontSize: Typography.body,
    textAlign: 'right',
  },
});
