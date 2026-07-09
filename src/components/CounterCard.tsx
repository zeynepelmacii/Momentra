import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { Counter } from "../types/counter";
import { Trash2, Pencil } from "lucide-react-native";

type Props = {
  counter: Counter;
  onDeleteCounter: (id: string) => void;
  onEditCounter: (counter: Counter) => void;
  useTotalDays: boolean;
};

type TimePart = {
  label: string;
  value: number;
};

function getTimeParts(counter: Counter, useTotalDays: boolean) {
  const now = Date.now();
  const target = new Date(counter.targetDate).getTime();

  const diff =
    counter.type === "countdown"
      ? Math.max(target - now, 0)
      : Math.max(now - target, 0);

  const totalSeconds = Math.floor(diff / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInMonth = 30 * secondsInDay;
  const secondsInYear = 365 * secondsInDay;

  const years = Math.floor(totalSeconds / secondsInYear);
  const afterYears = totalSeconds % secondsInYear;

  const months = Math.floor(afterYears / secondsInMonth);
  const afterMonths = afterYears % secondsInMonth;

  const days = Math.floor(afterMonths / secondsInDay);
  const afterDays = afterMonths % secondsInDay;

  const hours = Math.floor(afterDays / secondsInHour);
  const afterHours = afterDays % secondsInHour;

  const minutes = Math.floor(afterHours / secondsInMinute);
  const seconds = afterHours % secondsInMinute;

  const totalDays = Math.floor(totalSeconds / secondsInDay);

  const parts: TimePart[] = [];

  if (useTotalDays) {
    parts.push({ label: "Days", value: totalDays });
  } else {
    if (years > 0) {
      parts.push({ label: "Years", value: years });
      parts.push({ label: "Months", value: months });
    } else if (months > 0) {
      parts.push({ label: "Months", value: months });
    }

    parts.push({ label: "Days", value: days });
  }

  parts.push({ label: "Hours", value: hours });
  parts.push({ label: "Min", value: minutes });
  parts.push({ label: "Sec", value: seconds });

  return {
    parts,
    isFinished: counter.type === "countdown" && diff === 0,
  };
}

function getCountdownProgress(counter: Counter) {
  if (counter.type !== "countdown") return null;

  const now = Date.now();
  const start = new Date(counter.createdAt).getTime();
  const target = new Date(counter.targetDate).getTime();

  if (!start || !target || target <= start) return 0;

  const progress = (now - start) / (target - start);

  return Math.min(Math.max(progress, 0), 1);
}

export default function CounterCard({
  counter,
  onDeleteCounter,
  onEditCounter,
  useTotalDays
}: Props) {
  const time = getTimeParts(counter, useTotalDays);
  const progress = getCountdownProgress(counter);

  return (
    <View style={[styles.card, time.isFinished && styles.finishedCard]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{counter.icon ?? "⭐"}</Text>
            <Text
              style={[
                styles.title,
                time.isFinished && styles.finishedTitle,
              ]}
            >
              {counter.title}
            </Text>
          </View>

          <Text
            style={[
              styles.type,
              time.isFinished && styles.finishedMutedText,
            ]}
          >
           {time.isFinished ? "Finished" : counter.type === "countdown" ? "Time left" : "Time passed"}
          </Text>
        </View>

      <View style={styles.rightSide}>
        <View style={styles.actions}>
          {!time.isFinished && (
            <Pressable
              onPress={() => onEditCounter(counter)}
              style={({ pressed }) => [
                styles.editButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
              ]}
            >
              <Pencil size={18} color={theme.colors.primary} />
            </Pressable>
          )}

          <Pressable
            onPress={() => onDeleteCounter(counter.id)}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
            ]}
          >
            <Trash2 size={18} color={time.isFinished ? "#fff" : theme.colors.primary} />
          </Pressable>
        </View>

        {time.isFinished && (
          <View style={styles.finishedBadge}>
            <Text style={styles.finishedBadgeText}>Finished</Text>
          </View>
        )}
      </View>
      </View>

      {!time.isFinished && (
        <View style={styles.timeRow}>
          {time.parts.map((part) => (
            <TimeBox
              key={part.label}
              label={part.label}
              value={part.value}
              totalItems={time.parts.length}
              isFinished={time.isFinished}
            />
          ))}
        </View>
      )}
      

      {counter.type === "countdown" && progress !== null && !time.isFinished && (
  <View style={styles.progressWrapper}>
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${progress * 100}%` },
        ]}
      />
    </View>

    <Text style={styles.progressText}>
      {Math.round(progress * 100)}% completed
    </Text>
  </View>
)}

    </View>
  );
}

function TimeBox({
  label,
  value,
  totalItems,
  isFinished,
}: {
  label: string;
  value: number;
  totalItems: number;
  isFinished: boolean;
}) {
  const boxWidth = totalItems > 4 ? "32%" : "24%";

  return (
    <View style={[styles.timeBox, { width: boxWidth }]}>
      <Text
        style={[
          styles.timeValue,
          isFinished && styles.finishedTimeValue,
        ]}
      >
        {String(value).padStart(2, "0")}
      </Text>
      <Text
        style={[
          styles.timeLabel,
          isFinished && styles.finishedMutedText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  finishedCard: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.border,
    opacity: 0.9,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 4,
  },
  rightSide: {
    alignItems: "flex-end",
    gap: 8,
  },
  finishedTitle: {
    color: "#f1f6fd",
  },
  type: {
    fontSize: 14,
    color: theme.colors.mutedText,
  },
  finishedMutedText: {
    color: "#94A3B8",
  },
  finishedBadge: {
    backgroundColor: "#89ff9dbd",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
  },
  finishedBadgeText: {
    color: "#0a690e",
  fontSize: 11,
  fontWeight: "800",
  letterSpacing: 0.4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
  timeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  timeBox: {
    alignItems: "center",
  },
  timeValue: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  finishedTimeValue: {
    color: "#64748B",
  },
  timeLabel: {
    fontSize: 12,
    color: theme.colors.mutedText,
    marginTop: 3,
  },
  progressWrapper: {
  marginTop: 16,
},
progressTrack: {
  height: 8,
  backgroundColor: theme.colors.primarySoft2,
  borderRadius: 999,
  overflow: "hidden",
},
progressFill: {
  height: "100%",
  backgroundColor: theme.colors.primary,
  borderRadius: 999,
},
progressText: {
  marginTop: 6,
  fontSize: 12,
  fontWeight: "700",
  color: theme.colors.mutedText,
  textAlign: "right",
},
});

