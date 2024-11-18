import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

const StatisticsPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/analitica.gif")}
          style={styles.gif}
          contentFit="contain"
        />
        <Text style={styles.title}>Estadísticas</Text>
      </View>
      <Text>Aqui van las Estadísticas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  gif: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: "SourGummy",
    color: "#2d3436",
  },
});

export default StatisticsPage;
