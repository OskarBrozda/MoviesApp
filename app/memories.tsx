import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MemoriesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Wspomnienia</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Tutaj będą Twoje wspomnienia</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  placeholder: {
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#aaa" },
});
