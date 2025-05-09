// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movie/[id]" options={{ title: "Szczegóły filmu" }} />
      <Stack.Screen
        name="person/[id]"
        options={{ title: "Szczegóły aktora" }}
      />
    </Stack>
  );
}
