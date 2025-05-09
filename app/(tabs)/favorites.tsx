// app/(tabs)/favorites.tsx
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FavoriteItem, FavoritesContext } from "../context/FavoritesContext";

export default function FavoritesScreen() {
  const { favorites } = useContext(FavoritesContext);
  const router = useRouter();
  const posterWidth = Dimensions.get("window").width * 0.4;

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Brak ulubionych jeszcze.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        const path =
          item.type === "movie" ? `/movie/${item.id}` : `/person/${item.id}`;
        router.push(path as any);
      }}
    >
      <Image
        source={{
          uri:
            item.type === "movie"
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : `https://image.tmdb.org/t/p/w200${item.profile_path}`,
        }}
        style={[
          styles.image,
          {
            width: posterWidth,
            height: posterWidth * (item.type === "movie" ? 1.5 : 1.3),
          },
        ]}
      />
      <Text style={styles.title} numberOfLines={1}>
        {item.type === "movie" ? item.title : item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={favorites}
      numColumns={2}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  item: { margin: 8, alignItems: "center" },
  image: { borderRadius: 8, backgroundColor: "#ddd" },
  title: {
    marginTop: 4,
    width: Dimensions.get("window").width * 0.4,
    textAlign: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
