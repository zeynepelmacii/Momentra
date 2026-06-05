import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type Props = {
  selectedDate: Date;
  visibleMonth: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onChangeMonth: (date: Date) => void;
  onSelectDate: (date: Date) => void;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function CalendarPicker({
  selectedDate,
  visibleMonth,
  minimumDate,
  maximumDate,
  onChangeMonth,
  onSelectDate,
}: Props) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells: Array<number | null> = [];

  for (let i = 0; i < firstWeekDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  function changeMonth(direction: -1 | 1) {
    const nextDate = new Date(year, month + direction, 1);

    if (minimumDate && nextDate < new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1)) {
      return;
    }

    if (maximumDate && nextDate > new Date(maximumDate.getFullYear(), maximumDate.getMonth(), 1)) {
      return;
    }

    onChangeMonth(nextDate);
  }

  function changeYear(direction: -1 | 1) {
    const nextDate = new Date(year + direction, month, 1);

    if (minimumDate && nextDate < new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1)) {
      return;
    }

    if (maximumDate && nextDate > new Date(maximumDate.getFullYear(), maximumDate.getMonth(), 1)) {
      return;
    }

    onChangeMonth(nextDate);
  }

  function isSelected(day: number) {
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  }

  function isDisabled(day: number) {
    const date = startOfDay(new Date(year, month, day));

    if (minimumDate && date < startOfDay(minimumDate)) return true;
    if (maximumDate && date > startOfDay(maximumDate)) return true;

    return false;
  }

  return (
    <View style={styles.container}>
      <View style={styles.pickerRow}>
        <View style={styles.pickerColumn}>
          <Pressable onPress={() => changeMonth(-1)}>
            <Text style={styles.navText}>‹</Text>
          </Pressable>

          <Text style={styles.pickerText}>{monthNames[month]}</Text>

          <Pressable onPress={() => changeMonth(1)}>
            <Text style={styles.navText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.pickerColumn}>
          <Pressable onPress={() => changeYear(-1)}>
            <Text style={styles.navText}>‹</Text>
          </Pressable>

          <Text style={styles.pickerText}>{year}</Text>

          <Pressable onPress={() => changeYear(1)}>
            <Text style={styles.navText}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.weekRow}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {cells.map((day, index) => {
          if (!day) return <View key={`empty-${index}`} style={styles.dayCell} />;

          const selected = isSelected(day);
          const disabled = isDisabled(day);

          return (
            <Pressable
              key={day}
              disabled={disabled}
              onPress={() => onSelectDate(new Date(year, month, day))}
              style={[
                styles.dayCell,
                selected && styles.selectedDay,
                disabled && styles.disabledDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selected && styles.selectedDayText,
                  disabled && styles.disabledDayText,
                ]}
              >
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  pickerColumn: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  pickerText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  navText: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: "700",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  selectedDay: {
    backgroundColor: theme.colors.primary,
  },
  disabledDay: {
    opacity: 0.25,
  },
  dayText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  selectedDayText: {
    color: theme.colors.white,
    fontWeight: "700",
  },
  disabledDayText: {
    color: theme.colors.mutedText,
  },
});