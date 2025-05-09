import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tmdbApi from "../../api/tmdbApi";
import { FavoritesContext } from "../context/FavoritesContext";

interface MovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  character?: string;
}

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
}

interface CreditsResponse {
  cast: MovieCredit[];
}

export default function PersonDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<MovieCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);
  const fav = person ? isFavorite(person.id, "person") : false;

  useEffect(() => {
    (async () => {
      try {
        const [{ data: p }, { data: c }] = await Promise.all([
          tmdbApi.get<PersonDetails>(`/person/${id}`),
          tmdbApi.get<CreditsResponse>(`/person/${id}/movie_credits`),
        ]);
        setPerson(p);
        setCredits(
          c.cast
            .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
            .sort((a, b) => b.id - a.id)
        );
      } catch (e) {
        console.error(e);
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
  if (!person) {
    return (
      <View style={styles.center}>
        <Text>Nie udało się załadować danych.</Text>
      </View>
    );
  }

  const posterWidth = screenWidth * 0.3;
  const renderCredit = ({ item }: { item: MovieCredit }) => (
    <TouchableOpacity
      style={{ marginRight: 12, width: posterWidth }}
      onPress={() => router.push(`/movie/${item.id}`)}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
          style={{
            width: posterWidth,
            height: posterWidth * 1.5,
            borderRadius: 6,
          }}
        />
      ) : (
        <View
          style={[
            styles.noImage,
            { width: posterWidth, height: posterWidth * 1.5 },
          ]}
        >
          <Text>Brak</Text>
        </View>
      )}
      <Text style={styles.creditTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {item.character && (
        <Text style={styles.creditChar} numberOfLines={1}>
          {item.character}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {person.profile_path && (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${person.profile_path}`,
          }}
          style={styles.profileImage}
        />
      )}
      <TouchableOpacity
        onPress={() =>
          fav
            ? removeFavorite(person.id, "person")
            : addFavorite({
                id: person.id,
                type: "person",
                name: person.name,
                profile_path: person.profile_path || undefined,
              })
        }
        style={{ position: "absolute", top: 16, right: 16 }}
      >
        <Ionicons
          name={fav ? "heart" : "heart-outline"}
          size={24}
          color="tomato"
        />
      </TouchableOpacity>
      <Text style={styles.name}>{person.name}</Text>
      {person.birthday && (
        <Text style={styles.meta}>
          {person.birthday}{" "}
          {person.place_of_birth ? `• ${person.place_of_birth}` : ""}
        </Text>
      )}
      {person.biography ? (
        <Text style={styles.bio}>{person.biography}</Text>
      ) : (
        <Text style={styles.bio}>Brak biografii</Text>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filmografia</Text>
        <FlatList
          horizontal
          data={credits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCredit}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileImage: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.9,
    borderRadius: 12,
    alignSelf: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
  },
  meta: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 12 },
  bio: { fontSize: 16, lineHeight: 22, marginBottom: 16 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  noImage: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  creditTitle: { fontSize: 12, marginTop: 4 },
  creditChar: { fontSize: 11, color: "#666" },
});
