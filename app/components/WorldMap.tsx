import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
// @ts-ignore
import WorldSvg from "../../assets/images/world.svg";

interface WorldMapProps {
  visited?: string[];
  width?: number;
  height?: number;
}

export default function WorldMap({
  visited = [],
  width = Dimensions.get("window").width - 48,
  height = 200,
}: WorldMapProps) {
  return (
    <View style={styles.container}>
      <WorldSvg width={width} height={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginBottom: 24,
  },
});
