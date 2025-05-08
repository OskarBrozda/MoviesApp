import AsyncStorage from "@react-native-async-storage/async-storage";
import { Country } from "../types//country";
import { Memory } from "../types/memory";

const COUNTRIES_KEY = "COUNTRIES";
const MEMORIES_KEY = "MEMORIES";

// Pobiera listę krajów (lub [] jeśli pusty)
export async function getCountries(): Promise<Country[]> {
  const json = await AsyncStorage.getItem(COUNTRIES_KEY);
  return json ? JSON.parse(json) : [];
}

// Zapisuje całą listę krajów
export async function saveCountries(list: Country[]): Promise<void> {
  await AsyncStorage.setItem(COUNTRIES_KEY, JSON.stringify(list));
}

// Dodaje pojedynczy kraj
export async function addCountry(c: Country): Promise<void> {
  const list = await getCountries();
  list.push(c);
  await saveCountries(list);
}

// Aktualizuje istniejący kraj
export async function updateCountry(c: Country): Promise<void> {
  const list = await getCountries();
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx !== -1) {
    list[idx] = c;
    await saveCountries(list);
  }
}

// Podobnie dla wspomnień (przykład)
export async function getMemories(): Promise<Memory[]> {
  const json = await AsyncStorage.getItem(MEMORIES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function addMemory(m: Memory): Promise<void> {
  const list = await getMemories();
  list.push(m);
  await AsyncStorage.setItem(MEMORIES_KEY, JSON.stringify(list));
}
