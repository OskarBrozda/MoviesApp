import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tmdbApi from "../api/tmdbApi";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const windowWidth = Dimensions.get("window").width;
  const posterWidth = windowWidth * 0.4;
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await tmdbApi.get<{ results: Movie[] }>(
          "/trending/movie/day"
        );
        setMovies(res.data.results);
        console.log("Trending:", res.data.results);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending Today</Text>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => router.push(`/movie/${item.id}`)}
          >
            {item.poster_path ? (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
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
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  title: {
    width: Dimensions.get("window").width * 0.4,
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
