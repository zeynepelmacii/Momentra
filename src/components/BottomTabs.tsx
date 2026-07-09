import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type TabType = "home" | "create";

type Props = {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
};

export default function BottomTabs({ activeTab, onChangeTab }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChangeTab("home")}
        style={[
          styles.button,
          activeTab === "home" && styles.activeButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === "home" && styles.activeButtonText,
          ]}
        >
          My Counters
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChangeTab("create")}
        style={[
          styles.button,
          activeTab === "create" && styles.activeButton,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === "create" && styles.activeButtonText,
          ]}
        >
          Create Counter
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 14,
    padding: 3,
    backgroundColor: theme.colors.tabBackground,
    borderRadius: 20,
    flexDirection: "row",
    shadowColor: "#040036",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.mutedText,
  },
  activeButtonText: {
    color: theme.colors.white,
  },
});