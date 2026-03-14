import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

type ReminderTimeFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  helper: string;
  invalid?: boolean;
};

export const ReminderTimeField = ({ label, value, onChangeText, helper, invalid = false }: ReminderTimeFieldProps) => {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const timeParts = parseStoredTime(value);

  const setHour = (nextHour: number) => {
    onChangeText(toStoredTime(nextHour, timeParts.minute, timeParts.period));
  };

  const setMinute = (nextMinute: number) => {
    onChangeText(toStoredTime(timeParts.hour, nextMinute, timeParts.period));
  };

  const setPeriod = (nextPeriod: Meridiem) => {
    onChangeText(toStoredTime(timeParts.hour, timeParts.minute, nextPeriod));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.clockCard, invalid && styles.clockCardInvalid]}>
        <Text style={styles.clockLabel}>Selected time</Text>
        <Text style={styles.clockValue}>
          {timeParts.hour}:{String(timeParts.minute).padStart(2, "0")} {timeParts.period}
        </Text>
        <View style={styles.controlsRow}>
          <View style={styles.controlBlock}>
            <Text style={styles.controlLabel}>Hour</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setHour(wrapHour(timeParts.hour - 1))} style={styles.stepperButton}>
                <Text style={styles.stepperSymbol}>-</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{timeParts.hour}</Text>
              <Pressable onPress={() => setHour(wrapHour(timeParts.hour + 1))} style={styles.stepperButton}>
                <Text style={styles.stepperSymbol}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.controlBlock}>
            <Text style={styles.controlLabel}>Minute</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setMinute(wrapMinute(timeParts.minute - 5))}
                style={styles.stepperButton}
              >
                <Text style={styles.stepperSymbol}>-</Text>
              </Pressable>
              <Text style={styles.stepperValue}>{String(timeParts.minute).padStart(2, "0")}</Text>
              <Pressable
                onPress={() => setMinute(wrapMinute(timeParts.minute + 5))}
                style={styles.stepperButton}
              >
                <Text style={styles.stepperSymbol}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.periodRow}>
          {(["AM", "PM"] as const).map((period) => {
            const active = timeParts.period === period;
            return (
              <Pressable
                key={period}
                onPress={() => setPeriod(period)}
                style={[styles.periodButton, active && styles.periodButtonActive]}
              >
                <Text style={[styles.periodButtonLabel, active && styles.periodButtonLabelActive]}>{period}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text style={[styles.helper, invalid && styles.helperInvalid]}>{helper}</Text>
    </View>
  );
};

type Meridiem = "AM" | "PM";

const parseStoredTime = (value: string) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  const hour24 = match ? Number(match[1]) : 7;
  const minute = match ? Number(match[2]) : 0;

  if (hour24 === 0) {
    return { hour: 12, minute, period: "AM" as const };
  }

  if (hour24 === 12) {
    return { hour: 12, minute, period: "PM" as const };
  }

  if (hour24 > 12) {
    return { hour: hour24 - 12, minute, period: "PM" as const };
  }

  return { hour: hour24, minute, period: "AM" as const };
};

const toStoredTime = (hour12: number, minute: number, period: Meridiem) => {
  const safeHour = wrapHour(hour12);
  const safeMinute = wrapMinute(minute);
  let hour24 = safeHour % 12;

  if (period === "PM") {
    hour24 += 12;
  }

  return `${String(hour24).padStart(2, "0")}:${String(safeMinute).padStart(2, "0")}`;
};

const wrapHour = (value: number) => {
  if (value < 1) {
    return 12;
  }

  if (value > 12) {
    return 1;
  }

  return value;
};

const wrapMinute = (value: number) => {
  if (value < 0) {
    return 55;
  }

  if (value > 55) {
    return 0;
  }

  return Math.round(value / 5) * 5;
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.xs
    },
    label: {
      color: theme.colors.ink,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    },
    clockCard: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.cardMuted,
      padding: theme.spacing.md,
      gap: theme.spacing.sm
    },
    clockCardInvalid: {
      borderColor: theme.colors.danger
    },
    clockLabel: {
      color: theme.colors.muted,
      fontSize: 12,
      fontFamily: theme.typography.bodyFamily,
      textTransform: "uppercase",
      letterSpacing: 0.6
    },
    clockValue: {
      color: theme.colors.ink,
      fontSize: 28,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    controlsRow: {
      flexDirection: "row",
      gap: theme.spacing.sm
    },
    controlBlock: {
      flex: 1,
      gap: theme.spacing.xs
    },
    controlLabel: {
      color: theme.colors.ink,
      fontWeight: "600",
      fontFamily: theme.typography.bodyFamily
    },
    stepper: {
      alignItems: "center",
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs
    },
    stepperButton: {
      alignItems: "center",
      backgroundColor: theme.colors.cardMuted,
      borderRadius: theme.radii.pill,
      height: 36,
      justifyContent: "center",
      width: 36
    },
    stepperSymbol: {
      color: theme.colors.ink,
      fontSize: 18,
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
    },
    stepperValue: {
      color: theme.colors.ink,
      fontSize: 22,
      fontWeight: "700",
      fontFamily: theme.typography.headingFamily
    },
    periodRow: {
      flexDirection: "row",
      gap: theme.spacing.sm
    },
    periodButton: {
      flex: 1,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.pill,
      paddingVertical: 12,
      backgroundColor: theme.colors.card
    },
    periodButtonActive: {
      backgroundColor: theme.colors.maroon,
      borderColor: theme.colors.maroon
    },
    periodButtonLabel: {
      color: theme.colors.ink,
      fontWeight: "700",
      fontFamily: theme.typography.bodyFamily
    },
    periodButtonLabelActive: {
      color: "#fff7f0"
    },
    helper: {
      color: theme.colors.muted,
      fontSize: 12,
      fontFamily: theme.typography.bodyFamily
    },
    helperInvalid: {
      color: theme.colors.danger
    }
  });
