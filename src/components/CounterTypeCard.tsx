import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type Props = {
  title: string;
  description: string;
  onPress: () => void;
};

export default function CounterTypeCard({
  title,
  description,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topContent}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {title === "Countdown" ? "Future" : "Past"}
          </Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Create counter</Text>

        <View style={styles.arrowWrapper}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 230,
    borderRadius: 32,
    padding: 26,
    justifyContent: "space-between",

    backgroundColor: theme.colors.primary,

    shadowColor: theme.colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,

    overflow: "hidden",
  },

  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  topContent: {
    gap: 16,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1.3,
  },

  description: {
    fontSize: 16,
    lineHeight: 25,
    color: "rgba(255,255,255,0.82)",
    maxWidth: "92%",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },

  footerText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    fontWeight: "600",
  },

  arrowWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,

    backgroundColor: "rgba(255,255,255,0.16)",

    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
});