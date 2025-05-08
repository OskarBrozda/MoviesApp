import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function EditPlaceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edytuj miejsce</Text>
      <TextInput
        style={styles.input}
        placeholder="Kod ISO kraju"
        value={countryCode}
        onChangeText={setCountryCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Nazwa kraju"
        value={countryName}
        onChangeText={setCountryName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Wspomnienia / Notatki"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Zapisz zmiany</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textArea: { height: 120, textAlignVertical: "top" },
  button: {
    backgroundColor: "#ffc107",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
