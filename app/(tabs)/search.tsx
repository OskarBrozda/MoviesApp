import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tmdbApi from "../../api/tmdbApi";

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;
}

interface PersonItem {
  id: number;
  name: string;
  profile_path: string | null;
}

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [people, setPeople] = useState<PersonItem[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useRef(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setMovies([]);
        setPeople([]);
        setLoading(false);
        return;
      }
      try {
        const [mRes, pRes] = await Promise.all([
          tmdbApi.get<{ results: MovieItem[] }>("/search/movie", {
            params: { query: q },
          }),
          tmdbApi.get<{ results: PersonItem[] }>("/search/person", {
            params: { query: q },
          }),
        ]);
        setMovies(mRes.data.results.slice(0, 5));
        setPeople(pRes.data.results.slice(0, 5));
      } catch (e) {
        console.warn("Search error", e);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    setLoading(true);
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, query]);

  const renderMovie = ({ item }: { item: MovieItem }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        Keyboard.dismiss();
        router.push(`/movie/${item.id}`);
      }}
    >
      {item.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }}
          style={styles.thumb}
        />
      )}
      <Text style={styles.rowText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderPerson = ({ item }: { item: PersonItem }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        Keyboard.dismiss();
        router.push(`/actor/${item.id}`);
      }}
    >
      {item.profile_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w92${item.profile_path}` }}
          style={styles.thumb}
        />
      )}
      <Text style={styles.rowText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Szukaj filmów lub aktorów..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

      {!loading &&
        movies.length + people.length === 0 &&
        query.trim().length > 0 && (
          <Text style={styles.notFound}>Brak wyników dla „{query}”</Text>
        )}

      {!loading && (
        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              {movies.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Filmy</Text>
                  <FlatList
                    data={movies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMovie}
                    scrollEnabled={false}
                  />
                </View>
              )}
              {people.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Aktorzy</Text>
                  <FlatList
                    data={people}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPerson}
                    scrollEnabled={false}
                  />
                </View>
              )}
            </>
          }
          renderItem={null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  thumb: {
    width: 40,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  rowText: { fontSize: 16, flexShrink: 1 },
  notFound: { marginTop: 24, textAlign: "center", color: "#666" },
});
