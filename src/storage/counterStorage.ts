import AsyncStorage from "@react-native-async-storage/async-storage";
import { Counter } from "../types/counter";

const COUNTERS_KEY = "tikitime:counters";

export async function loadCounters(): Promise<Counter[]> {
  const raw = await AsyncStorage.getItem(COUNTERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveCounters(counters: Counter[]) {
  await AsyncStorage.setItem(COUNTERS_KEY, JSON.stringify(counters));
}