import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCountries } from "./services/storage";
import { Country } from "./types/country";

export default function CountriesScreen() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetch = async () => {
        setLoading(true);
        try {
          const list = await getCountries();
          if (isActive) setCountries(list);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetch();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const renderItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/edit-place?id=${item.id}`)}
    >
      <Text style={styles.itemText}>
        {item.name} ({item.code})
      </Text>
    </TouchableOpacity>
  );

  if (loading || countries === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (countries.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Brak dodanych krajów. 🗺️</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista krajów</Text>
      <FlatList
        data={countries}
        keyExtractor={(c) => c.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  item: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  itemText: { fontSize: 16 },
  separator: { height: 8 },
});
