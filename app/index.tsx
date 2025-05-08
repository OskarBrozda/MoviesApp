import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odwiedzone kraje</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>17</Text>
          <Text style={styles.statLabel}>Kraje</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Kontynenty</Text>
        </View>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={{ color: "#aaa" }}>[Tutaj pojawi się mapa]</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/memories")}
      >
        <Text style={styles.buttonText}>📷 Zobacz wspomnienia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.addButton]}
        onPress={() => router.push("/add-country")}
      >
        <Text style={styles.buttonText}>➕ Dodaj kraj</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/countries")}
      >
        <Text style={styles.buttonText}>📋 Lista miejsc</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/statistics")}
      >
        <Text style={styles.buttonText}>📊 Statystyki</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.buttonText}>⚙️ Ustawienia</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
    color: "#555",
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#28A745",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textTransform: "uppercase",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
});
