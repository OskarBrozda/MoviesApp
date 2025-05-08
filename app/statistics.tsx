import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function StatisticsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Statystyki</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Wykresy pojawią się tutaj</Text>
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
