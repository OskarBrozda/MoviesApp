import { Stack } from "expo-router";
import React from "react";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="movie/[id]"
          options={{ title: "Szczegóły filmu" }}
        />
        <Stack.Screen
          name="person/[id]"
          options={{ title: "Szczegóły aktora" }}
        />
      </Stack>
    </FavoritesProvider>
  );
}
