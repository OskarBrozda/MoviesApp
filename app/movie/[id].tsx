import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tmdbApi from "../../api/tmdbApi";

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

interface MovieSummary {
  id: number;
  title: string;
  poster_path: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  credits: { cast: CastMember[] };
  videos: { results: Video[] };
  similar: { results: MovieSummary[] };
  recommendations: { results: MovieSummary[] };
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;
  const posterWidth = screenWidth * 0.7;
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await tmdbApi.get<MovieDetails>(`/movie/${id}`, {
          params: {
            append_to_response: "credits,videos,similar,recommendations",
          },
        });
        setMovie(res.data);
      } catch (e) {
        console.error("Błąd pobierania szczegółów:", e);
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
  if (!movie) {
    return (
      <View style={styles.center}>
        <Text>Nie udało się załadować danych.</Text>
      </View>
    );
  }

  const trailer = movie.videos.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  const renderPerson = ({ item }: { item: CastMember }) => (
    <TouchableOpacity
      style={styles.person}
      onPress={() => router.push(`/actor/${item.id}`)}
    >
      {item.profile_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w200${item.profile_path}`,
          }}
          style={styles.personImage}
        />
      ) : (
        <View style={[styles.personImage, styles.noImage]}>
          <Text>Brak</Text>
        </View>
      )}
      <Text style={styles.personName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.personChar} numberOfLines={1}>
        {item.character}
      </Text>
    </TouchableOpacity>
  );

  const renderMovie = ({ item }: { item: MovieSummary }) => (
    <View style={styles.similar}>
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
          style={styles.similarImage}
        />
      ) : (
        <View style={[styles.similarImage, styles.noImage]}>
          <Text>Brak</Text>
        </View>
      )}
      <Text style={styles.similarTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {movie.poster_path && (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={{
            width: posterWidth,
            height: posterWidth * 1.5,
            alignSelf: "center",
            borderRadius: 12,
          }}
        />
      )}
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.subtitle}>
        {movie.release_date.slice(0, 4)} • Ocena:{" "}
        {movie.vote_average.toFixed(1)}
      </Text>
      <Text style={styles.overview}>{movie.overview}</Text>

      {trailer && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zwiastun</Text>
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`)
            }
          >
            Obejrzyj na YouTube: {trailer.name}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Obsada</Text>
        <FlatList
          horizontal
          data={movie.credits.cast}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPerson}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {movie.similar.results.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Podobne filmy</Text>
          <FlatList
            horizontal
            data={movie.similar.results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovie}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {movie.recommendations.results.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekomendacje</Text>
          <FlatList
            horizontal
            data={movie.recommendations.results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovie}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 12 },
  subtitle: { fontSize: 14, color: "#666", marginVertical: 4 },
  overview: { fontSize: 16, marginVertical: 12, lineHeight: 22 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  link: { color: "#1e90ff", textDecorationLine: "underline" },
  person: { width: 100, marginRight: 12, alignItems: "center" },
  personImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  noImage: { justifyContent: "center", alignItems: "center" },
  personName: { fontSize: 12, fontWeight: "500", marginTop: 4 },
  personChar: { fontSize: 11, color: "#666" },
  similar: { width: 120, marginRight: 12 },
  similarImage: {
    width: 120,
    height: 180,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  similarTitle: { width: 120, fontSize: 12, marginTop: 4 },
});
