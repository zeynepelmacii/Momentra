import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type Props = {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
};

const ITEM_HEIGHT = 44;

export default function TimeWheelPicker({ label, value, max, onChange }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const data = Array.from({ length: max + 1 }, (_, index) => index);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      y: value * ITEM_HEIGHT,
      animated: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.wheel}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.y / ITEM_HEIGHT
            );

            const nextValue = data[index];

            if (nextValue !== undefined) {
              onChange(nextValue);
            }
          }}
        >
          {data.map((item) => {
            const isSelected = item === value;

            return (
              <View key={item} style={styles.item}>
                <Text
                  style={[
                    styles.itemText,
                    isSelected && styles.selectedItemText,
                  ]}
                >
                  {String(item).padStart(2, "0")}
                </Text>
              </View>
            );
          })} 
        </ScrollView>

        <View pointerEvents="none" style={styles.selectionOverlay} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: theme.colors.mutedText,
    fontSize: 13,
    marginBottom: 8,
  },
  wheel: {
    height: ITEM_HEIGHT * 3,
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  listContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 18,
    color: theme.colors.mutedText,
  },
  selectedItemText: {
    fontSize: 24,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  selectionOverlay: {
    position: "absolute",
    left: 8,
    right: 8,
    top: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    borderRadius: 14,
    backgroundColor: theme.colors.primarySoft,
    opacity: 0.45,
  },
});