import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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

const posterWidth = Dimensions.get("window").width * 0.2;

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

  const [suggestions, setSuggestions] = useState<MovieItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await tmdbApi.get<{ results: MovieItem[] }>(
          "/trending/movie/day"
        );
        setSuggestions(res.data.results.slice(0, 10));
      } catch (e) {
        console.warn("Nie udało się pobrać sugestii:", e);
      }
    })();
  }, []);

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
  }, [query]);

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
          source={{
            uri: `https://image.tmdb.org/t/p/w92${item.profile_path}`,
          }}
          style={styles.thumb}
        />
      )}
      <Text style={styles.rowText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSuggestion = ({ item }: { item: MovieItem }) => (
    <TouchableOpacity
      style={styles.suggItem}
      onPress={() => router.push(`/movie/${item.id}`)}
    >
      {item.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w185${item.poster_path}`,
          }}
          style={styles.suggThumb}
        />
      ) : (
        <View style={[styles.thumb, styles.noImagePlaceholder]} />
      )}
      <Text style={styles.suggText} numberOfLines={1}>
        {item.title}
      </Text>
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

      {!loading && query.trim().length > 0 && (
        <>
          {movies.length === 0 && people.length === 0 ? (
            <Text style={styles.notFound}>Brak wyników dla „{query}”</Text>
          ) : (
            <FlatList
              data={[]}
              ListHeaderComponent={
                <>
                  {movies.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Filmy</Text>
                      <FlatList
                        data={movies}
                        keyExtractor={(i) => i.id.toString()}
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
                        keyExtractor={(i) => i.id.toString()}
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
        </>
      )}

      {!loading && query.trim().length === 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Często oglądane:</Text>
          <FlatList
            horizontal
            data={suggestions}
            keyExtractor={(i) => i.id.toString()}
            renderItem={renderSuggestion}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
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

  suggItem: {
    marginRight: 12,
    alignItems: "center",
    width: posterWidth,
  },
  suggThumb: {
    width: posterWidth,
    height: posterWidth * 1.5,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  suggText: {
    marginTop: 6,
    fontSize: 12,
    width: posterWidth,
    textAlign: "center",
  },
  noImagePlaceholder: { backgroundColor: "#ccc" },
});
