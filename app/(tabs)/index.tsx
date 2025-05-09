import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tmdbApi from "../../api/tmdbApi";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

export default function HomeScreen() {
  const router = useRouter();
  const windowWidth = Dimensions.get("window").width;
  const posterWidth = windowWidth * 0.4;

  const [trending, setTrending] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [trRes, upRes] = await Promise.all([
        tmdbApi.get<{ results: Movie[] }>("/trending/movie/day"),
        tmdbApi.get<{ results: Movie[] }>("/movie/upcoming"),
      ]);
      setTrending(trRes.data.results);
      setUpcoming(upRes.data.results.slice(0, 10));
    } catch (e) {
      console.error("Fetch error:", e);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAll().finally(() => setRefreshing(false));
  };

  const renderMoviePoster = (item: Movie) => (
    <TouchableOpacity
      key={item.id}
      style={{ marginRight: 12 }}
      onPress={() => router.push(`/movie/${item.id}`)}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
          style={{
            width: posterWidth,
            height: posterWidth * 1.5,
            borderRadius: 8,
          }}
        />
      ) : (
        <View
          style={[
            styles.noImage,
            { width: posterWidth, height: posterWidth * 1.5 },
          ]}
        >
          <Text>No Image</Text>
        </View>
      )}
      <Text style={[styles.title, { width: posterWidth }]} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Na czasie</Text>
      <FlatList
        horizontal
        data={trending}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMoviePoster(item)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      <Text style={styles.header}>Nadchodzace</Text>
      <FlatList
        horizontal
        data={upcoming}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderMoviePoster(item)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginVertical: 12 },
  title: {
    marginTop: 4,
    fontSize: 14,
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
});
