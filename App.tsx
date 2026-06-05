import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from "expo-notifications";

import Header from "./src/components/Header";
import CreateCounterScreen from "./src/components/CreateCounterScreen";
import BottomTabs from "./src/components/BottomTabs";
import HomePage from "./src/components/HomePage";
import IntroScreen from "./src/components/IntroScreen";

import { Counter } from "./src/types/counter";
import { loadCounters, saveCounters } from "./src/storage/counterStorage";

type TabType = "home" | "create";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [counters, setCounters] = useState<Counter[]>([]);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const [hideBottomTabs, setHideBottomTabs] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Notification permission not granted");
      }
    }

    requestPermissions();
  }, []);
  useEffect(() => {
    loadCounters().then(setCounters);
  }, []);

  useEffect(() => {
    saveCounters(counters);
  }, [counters]);

async function handleCreateCounter(counter: Counter) {
  if (counter.type === "countdown") {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Countdown finished 🎉",
        body: `${counter.title} has finished.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(counter.targetDate),
      },
    });
  }

  setCounters((currentCounters) => [counter, ...currentCounters]);
  setEditingCounter(null);
  setHideBottomTabs(false);
  setActiveTab("home");
}

function handleUpdateCounter(updatedCounter: Counter) {
  setCounters((currentCounters) =>
    currentCounters.map((counter) =>
      counter.id === updatedCounter.id ? updatedCounter : counter
    )
  );

  setEditingCounter(null);
  setHideBottomTabs(false);
  setActiveTab("home");
}

  function handleDeleteCounter(counterId: string) {
    setCounters((currentCounters) =>
      currentCounters.filter((counter) => counter.id !== counterId)
    );
  }

  function handleEditCounter(counter: Counter) {
    setEditingCounter(counter);
    setHideBottomTabs(true);
    setActiveTab("create");
  }

  function handleTabChange(tab: TabType) {
    if (tab === "create") {
      setEditingCounter(null);
    }

    setActiveTab(tab);
  }



return (
  <SafeAreaProvider>
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      {showIntro ? (
        <IntroScreen onFinish={() => setShowIntro(false)} />
      ) : (
        <View style={styles.container}>
          <Header />

          <View style={styles.content}>
            {activeTab === "home" ? (
              <HomePage
                counters={counters}
                onDeleteCounter={handleDeleteCounter}
                onEditCounter={handleEditCounter}
              />
            ) : (
              <CreateCounterScreen
                editingCounter={editingCounter}
                onCreateCounter={handleCreateCounter}
                onUpdateCounter={handleUpdateCounter}
                onHideBottomTabs={() => setHideBottomTabs(true)}
                onShowBottomTabs={() => setHideBottomTabs(false)}
                onCancelEdit={() => {
                  setEditingCounter(null);
                  setHideBottomTabs(false);
                  setActiveTab("home");
                }}
              />
            )}
          </View>

          {!hideBottomTabs && (
            <BottomTabs activeTab={activeTab} onChangeTab={handleTabChange} />
          )}
        </View>
      )}
    </SafeAreaView>
  </SafeAreaProvider>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f9ff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
  },
  content: {
    flex: 1,
  },
});