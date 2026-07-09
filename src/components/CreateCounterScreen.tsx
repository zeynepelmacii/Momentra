import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../theme";
import CounterForm from "./CounterForm";
import CounterTypeCard from "./CounterTypeCard";
import { Counter, CounterType } from "../types/counter";

type Props = {
  editingCounter: Counter | null;
  onCreateCounter: (counter: Counter) => void;
  onUpdateCounter: (counter: Counter) => void;
  onHideBottomTabs: () => void;
  onShowBottomTabs: () => void;
  onCancelEdit: () => void;
};

export default function CreateCounterScreen({
  editingCounter,
  onCreateCounter,
  onUpdateCounter,
  onHideBottomTabs,
  onShowBottomTabs,
  onCancelEdit,
}: Props) {
  const [selectedType, setSelectedType] = useState<CounterType | null>(
    editingCounter ? editingCounter.type : null
  );

  const formScrollRef = useRef<ScrollView>(null);

  function scrollToTitleInput() {
    setTimeout(() => {
      formScrollRef.current?.scrollTo({
        y: 100,
        animated: true,
      });
    }, 250);
  }

  if (selectedType) {
    const title = selectedType === "countdown" ? "Countdown" : "Count-up";
    const description =
      selectedType === "countdown"
        ? "Track how much time is left until a future moment."
        : "Track how much time has passed since a past moment.";

    return (
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          ref={formScrollRef}
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.backgroundBlobOne} />
        <View style={styles.backgroundBlobTwo} />

        <Pressable
          onPress={() => {
            if (editingCounter) {
              onCancelEdit();
              return;
            }

            setSelectedType(null);
            onShowBottomTabs();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>
            {editingCounter ? "Update your moment" : "Create your moment"}
          </Text>

          <Text style={styles.pageTitle}>
            {editingCounter ? `Edit ${title}` : title}
          </Text>

          <Text style={styles.pageDescription}>{description}</Text>
        </View>

        <View style={styles.formCard}>
          <CounterForm
            type={selectedType}
            editingCounter={editingCounter}
            onCreateCounter={onCreateCounter}
            onUpdateCounter={onUpdateCounter}
            onTitleFocus={scrollToTitleInput}
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.selectionContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backgroundBlobOne} />
      <View style={styles.backgroundBlobTwo} />
      <View style={styles.backgroundBlobThree} />
      <View style={styles.backgroundBlobFour} />

      <View style={styles.heroSection}>
        <Text style={styles.eyebrow}>New counter</Text>
        <Text style={styles.pageTitle}>Create Counter</Text>
        <Text style={styles.pageDescription}>
          Choose what kind of time moment you want to track.
        </Text>
      </View>

      <View style={styles.cardsWrapper}>
        <View style={styles.cardShell}>
          <CounterTypeCard
            title="Countdown"
            description="Track how much time is left until a future moment."
            onPress={() => {
                setSelectedType("countdown");
                onHideBottomTabs();
            }}
          />
        </View>

        <View style={styles.cardShell}>
          <CounterTypeCard
            title="Count-up"
            description="Track how much time has passed since a past moment."
            onPress={() => {
                setSelectedType("countup");
                onHideBottomTabs();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  keyboardContainer: {
  flex: 1,
},

  content: {
    flexGrow: 1,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  selectionContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 36,
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
  opacity: 0.11,
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
  opacity: 0.11,
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
  opacity: 0.11,
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
  opacity: 0.11,
},

  heroSection: {
    marginBottom: 26,
  },

  headerCard: {
    padding: 22,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },

  formCard: {
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.82)",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 22,
    elevation: 3,
  },

  cardsWrapper: {
    gap: 18,
  },

  cardShell: {
    borderRadius: 28,
    backgroundColor: theme.colors.tabBackground,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 4,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginBottom: 18,
  },

  backText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  pageTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: theme.colors.primary,
    marginBottom: 10,
    letterSpacing: -1.1,
  },

  pageDescription: {
    fontSize: 16,
    color: theme.colors.mutedText,
    lineHeight: 25,
    maxWidth: 330,
  },
});