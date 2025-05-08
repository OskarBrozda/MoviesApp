import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { addCountry } from "./services/storage";
import { Country } from "./types/country";

export default function AddCountryScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (!code.trim() || !name.trim()) {
      Alert.alert("Błąd", "Podaj kod i nazwę kraju.");
      return;
    }
    const newCountry: Country = {
      id: uuidv4(),
      code: code.trim().toUpperCase(),
      name: name.trim(),
      notes: "",
    };
    try {
      await addCountry(newCountry);
      router.back();
    } catch (e) {
      Alert.alert("Błąd", "Nie udało się zapisać kraju.");
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj nowy kraj</Text>
      <TextInput
        style={styles.input}
        placeholder="Kod ISO kraju (np. POL)"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Nazwa kraju"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Zapisz kraj</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
