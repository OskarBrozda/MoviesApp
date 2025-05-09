import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
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

export default function GenreDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const posterWidth = Dimensions.get("window").width * 0.45;

  useEffect(() => {
    (async () => {
      try {
        const res = await tmdbApi.get<{ results: Movie[] }>("/discover/movie", {
          params: { with_genres: id },
        });
        setMovies(res.data.results);
      } catch (e) {
        console.error("Error fetching movies by genre", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.item, { width: posterWidth }]}
          onPress={() => router.push(`/movie/${item.id}`)}
        >
          {item.poster_path ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
              }}
              style={[styles.image, { height: posterWidth * 1.5 }]}
            />
          ) : (
            <View
              style={[
                styles.image,
                styles.noImage,
                { height: posterWidth * 1.5 },
              ]}
            >
              <Text>No Image</Text>
            </View>
          )}
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12 },
  item: { margin: 6 },
  image: { width: "100%", borderRadius: 8, backgroundColor: "#ddd" },
  noImage: { justifyContent: "center", alignItems: "center" },
  title: { marginTop: 4, fontSize: 14, textAlign: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
