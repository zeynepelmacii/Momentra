import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { Counter } from "../types/counter";
import CounterCard from "./CounterCard";

type Props = {
  counters: Counter[];
  onDeleteCounter: (id: string) => void;
  onEditCounter: (counter: Counter) => void;
};

export default function HomePage({
  counters,
  onDeleteCounter,
  onEditCounter,
}: Props) {
  const [, setTick] = useState(0);
  const [useTotalDays, setUseTotalDays] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (counters.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundBlobOne} />
        <View style={styles.backgroundBlobTwo} />
        <View style={styles.backgroundBlobThree} />
        <View style={styles.backgroundBlobFour} />

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No counters yet</Text>
          <Text style={styles.emptyText}>
            Create your first Momentra counter.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBlobOne} />
      <View style={styles.backgroundBlobTwo} />
      <View style={styles.backgroundBlobThree} />
      <View style={styles.backgroundBlobFour} />

      <View style={styles.formatToggle}>
        <Pressable
          onPress={() => setUseTotalDays(false)}
          style={[
            styles.formatOption,
            !useTotalDays && styles.activeFormatOption,
          ]}
        >
          <Text
            style={[
              styles.formatText,
              !useTotalDays && styles.activeFormatText,
            ]}
          >
            Detailed
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setUseTotalDays(true)}
          style={[
            styles.formatOption,
            useTotalDays && styles.activeFormatOption,
          ]}
        >
          <Text
            style={[
              styles.formatText,
              useTotalDays && styles.activeFormatText,
            ]}
          >
            Total Days
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={counters}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CounterCard
            counter={item}
            onDeleteCounter={onDeleteCounter}
            onEditCounter={onEditCounter}
            useTotalDays={useTotalDays}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    overflow: "hidden",
  },
backgroundBlobOne: {
  position: "absolute",
  top: -110,
  right: -80,
  width: 230,
  height: 230,
  borderRadius: 115,
  backgroundColor: theme.colors.primary,
  boxShadow: "0px 0px 70px rgba(21, 59, 251, 0.96)",
  opacity: 0.3,
},

backgroundBlobTwo: {
  position: "absolute",
  top: 120,
  left: -95,
  width: 190,
  height: 190,
  borderRadius: 95,
  backgroundColor: theme.colors.primary,
  boxShadow: "0px 0px 70px rgba(21, 59, 251, 0.96)",
  opacity: 0.3,
},

backgroundBlobThree: {
  position: "absolute",
  top: 390,
  right: -75,
  width: 230,
  height: 230,
  borderRadius: 200,
  backgroundColor: theme.colors.primary,
  boxShadow: "0px 0px 70px rgba(21, 59, 251, 0.96)",
  opacity: 0.3,
},

backgroundBlobFour: {
  position: "absolute",
  bottom: -70,
  left: -36,
  width: 260,
  height: 235,
  borderRadius: 138,
  backgroundColor: theme.colors.primary,
  boxShadow: "0px 0px 70px rgba(21, 59, 251, 0.96)",
  opacity: 0.3,
},
  formatToggle: {
    flexDirection: "row",
    backgroundColor: theme.colors.tabBackground,
    padding: 4,
    borderRadius: 999,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    zIndex: 1,
  },

  formatOption: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 999,
  },

  activeFormatOption: {
    backgroundColor: theme.colors.white,
  },

  formatText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.mutedText,
  },

  activeFormatText: {
    color: theme.colors.primary,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: theme.colors.mutedText,
  },

  list: {
    padding: 20,
    paddingTop: 14,
    paddingBottom: 32,
  },
});