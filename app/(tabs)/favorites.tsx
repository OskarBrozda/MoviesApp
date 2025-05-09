import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FavoriteItem, FavoritesContext } from "../context/FavoritesContext";

export default function FavoritesScreen() {
  const { favorites } = useContext(FavoritesContext);
  const router = useRouter();

  const movieFavs = favorites.filter((f) => f.type === "movie");
  const actorFavs = favorites.filter((f) => f.type === "person");

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Brak ulubionych jeszcze.</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const PADDING = 16 * 2;
  const ITEM_MARGIN = 8 * 2;
  const colCount = 3;
  const posterWidth =
    (screenWidth - PADDING - ITEM_MARGIN * colCount) / colCount;
  const posterHeight = posterWidth * 1.5;

  const renderMovie = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      style={[styles.movieItem, { width: posterWidth, margin: 8 }]}
      onPress={() => router.push(`/movie/${item.id}`)}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w300${item.poster_path}` }}
        style={{ width: posterWidth, height: posterHeight, borderRadius: 8 }}
      />
      <Text style={styles.movieTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderActor = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      style={styles.actorItem}
      onPress={() => router.push(`/actor/${item.id}`)}
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }}
        style={styles.actorImage}
      />
      <Text style={styles.actorName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {movieFavs.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Ulubione filmy</Text>
          <FlatList
            data={movieFavs}
            keyExtractor={(item) => `movie-${item.id}`}
            renderItem={renderMovie}
            numColumns={colCount}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </>
      )}

      {actorFavs.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Ulubieni aktorzy</Text>
          <FlatList
            data={actorFavs}
            keyExtractor={(item) => `person-${item.id}`}
            renderItem={renderActor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24, paddingLeft: 16 }}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
  },

  movieItem: {
    alignItems: "center",
  },
  movieTitle: {
    marginTop: 6,
    fontSize: 14,
    width: "100%",
    textAlign: "center",
  },

  actorItem: {
    alignItems: "center",
    marginRight: 12,
  },
  actorImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  actorName: {
    marginTop: 6,
    fontSize: 13,
    width: 80,
    textAlign: "center",
  },
});
