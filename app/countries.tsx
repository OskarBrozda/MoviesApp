import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Country {
  id: string;
  code: string;
  name: string;
}
const sampleCountries: Country[] = [
  { id: "1", code: "POL", name: "Polska" },
  { id: "2", code: "DEU", name: "Niemcy" },
  { id: "3", code: "FRA", name: "Francja" },
];

export default function CountriesScreen() {
  const router = useRouter();
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista krajów</Text>
      <FlatList
        data={sampleCountries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  item: { padding: 12, borderRadius: 8, backgroundColor: "#f8f9fa" },
  itemText: { fontSize: 16 },
  separator: { height: 8 },
});
