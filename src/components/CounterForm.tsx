import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { theme } from "../theme";
import CalendarPicker from "./CalendarPicker";
import TimeWheelPicker from "./TimeWheelPicker";
import { Counter, CounterType } from "../types/counter";

type Props = {
  type: CounterType;
  editingCounter: Counter | null;
  onCreateCounter: (counter: Counter) => void;
  onUpdateCounter: (counter: Counter) => void;
};

const durationOptions = [
  { label: "1 day", ms: 24 * 60 * 60 * 1000 },
  { label: "7 days", ms: 7 * 24 * 60 * 60 * 1000 },
  { label: "30 days", ms: 30 * 24 * 60 * 60 * 1000 },
  { label: "60 days", ms: 60 * 24 * 60 * 60 * 1000 },
  { label: "90 days", ms: 90 * 24 * 60 * 60 * 1000 },
];

function getDefaultTitle(date: Date) {
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} | ${formattedTime}`;
}

export default function CounterForm({
  type,
  editingCounter,
  onCreateCounter,
  onUpdateCounter,
}: Props) {
  const initialDate = editingCounter
    ? new Date(editingCounter.targetDate)
    : type === "countdown"
    ? new Date(Date.now() + 24 * 60 * 60 * 1000)
    : new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [title, setTitle] = useState(editingCounter?.title ?? "");
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [visibleMonth, setVisibleMonth] = useState(initialDate);
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);

  const today = new Date();
  const isCompleted =
    editingCounter && editingCounter.type === "countdown"
      ? new Date(editingCounter.targetDate).getTime() <= Date.now()
      : false;

  function handleSelectDate(date: Date) {
    const nextDate = new Date(date);
    nextDate.setHours(selectedDate.getHours());
    nextDate.setMinutes(selectedDate.getMinutes());
    nextDate.setSeconds(0);
    nextDate.setMilliseconds(0);

    setSelectedDate(nextDate);
    setSelectedQuick(null);
  }

  function updateTime(hour: number, minute: number) {
    const nextDate = new Date(selectedDate);
    nextDate.setHours(hour);
    nextDate.setMinutes(minute);
    nextDate.setSeconds(0);
    nextDate.setMilliseconds(0);

    setSelectedDate(nextDate);
    setSelectedQuick(null);
  }

  function handleQuickDuration(label: string, ms: number) {
    const newDate =
      type === "countdown"
        ? new Date(Date.now() + ms)
        : new Date(Date.now() - ms);

    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    setSelectedDate(newDate);
    setVisibleMonth(newDate);
    setSelectedQuick(label);
  }

  function handleSubmit() {
    const cleanTitle = title.trim();
    const finalTitle = cleanTitle || getDefaultTitle(selectedDate);

    const now = Date.now();

    if (type === "countdown" && selectedDate.getTime() <= now) {
      Alert.alert("Invalid date", "Pick a future date.");
      return;
    }

    if (type === "countup" && selectedDate.getTime() >= now) {
      Alert.alert("Invalid date", "Pick a past date.");
      return;
    }

    if (editingCounter) {
      onUpdateCounter({
        ...editingCounter,
        title: finalTitle,
        targetDate: selectedDate.toISOString(),
      });

      return;
    }

    onCreateCounter({
      id: `${Date.now()}-${Math.random()}`,
      type,
      title: finalTitle,
      targetDate: selectedDate.toISOString(),
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Title</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Example: Birthday, Vacation, Exam"
        placeholderTextColor={theme.colors.mutedText}
        style={styles.input}
      />

      <Text style={styles.label}>Date</Text>

      <CalendarPicker
        selectedDate={selectedDate}
        visibleMonth={visibleMonth}
        minimumDate={type === "countdown" ? today : undefined}
        maximumDate={type === "countup" ? today : undefined}
        onChangeMonth={setVisibleMonth}
        onSelectDate={handleSelectDate}
      />

      <Text style={styles.label}>Time</Text>

      <View style={styles.timeWheelContainer}>
        <TimeWheelPicker
          label="Hour"
          value={selectedDate.getHours()}
          max={23}
          onChange={(hour) => updateTime(hour, selectedDate.getMinutes())}
        />

        <TimeWheelPicker
          label="Minute"
          value={selectedDate.getMinutes()}
          max={59}
          onChange={(minute) => updateTime(selectedDate.getHours(), minute)}
        />
      </View>

      <Text style={styles.label}>
        {type === "countdown" ? "Quick countdown" : "Quick count-up"}
      </Text>

      <View style={styles.durationGrid}>
        {durationOptions.map((option) => {
          const isSelected = selectedQuick === option.label;

          return (
            <Pressable
              key={option.label}
              onPress={() => handleQuickDuration(option.label, option.ms)}
              style={({ pressed }) => [
                styles.durationButton,
                isSelected && styles.selectedDurationButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text
                style={[
                  styles.durationText,
                  isSelected && styles.selectedDurationText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.createButton,
          pressed && styles.createButtonPressed,
        ]}
      >
        <Text style={styles.createButtonText}>
          {editingCounter ? "Update Counter" : "Create Counter"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 8,
    marginTop: 18,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: theme.colors.text,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  timeWheelContainer: {
    flexDirection: "row",
    gap: 12,
  },
  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  durationButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedDurationButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pressedButton: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  durationText: {
    color: theme.colors.text,
    fontWeight: "500",
    fontSize: 13,
  },
  selectedDurationText: {
    color: theme.colors.white,
  },
  createButton: {
    marginTop: 26,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  createButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  createButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});