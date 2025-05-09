// app/(tabs)/genres.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tmdbApi from "../../api/tmdbApi";

interface Genre {
  id: number;
  name: string;
}

export default function GenresScreen() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await tmdbApi.get<{ genres: Genre[] }>("/genre/movie/list");
        setGenres(res.data.genres);
      } catch (e) {
        console.error("Error fetching genres", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={genres}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push(`/genre/${item.id}`)}
        >
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  item: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  text: { fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
