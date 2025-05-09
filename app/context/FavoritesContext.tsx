import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";

export type FavoriteItem = {
  id: number;
  type: "movie" | "person";
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => Promise<void>;
  removeFavorite: (id: number, type: "movie" | "person") => Promise<void>;
  isFavorite: (id: number, type: "movie" | "person") => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const STORAGE_KEY = "@myapp_favorites";

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setFavorites(JSON.parse(json));
    })();
  }, []);

  const persist = async (newFav: FavoriteItem[]) => {
    setFavorites(newFav);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFav));
  };

  const addFavorite = async (item: FavoriteItem) => {
    if (favorites.find((f) => f.id === item.id && f.type === item.type)) return;
    await persist([item, ...favorites]);
  };

  const removeFavorite = async (id: number, type: "movie" | "person") => {
    await persist(favorites.filter((f) => !(f.id === id && f.type === type)));
  };

  const isFavorite = (id: number, type: "movie" | "person") =>
    !!favorites.find((f) => f.id === id && f.type === type);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
