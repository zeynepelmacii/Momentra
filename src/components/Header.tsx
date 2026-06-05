import { StyleSheet, Text, View, Image } from "react-native";
import { theme } from "../theme";


export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Tiki Time</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 1,
    backgroundColor: theme.colors.tabBackground,
  },

  logo: {
    width: 55,
    height: 52,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.primary,
    letterSpacing: -0.8,
  },
});