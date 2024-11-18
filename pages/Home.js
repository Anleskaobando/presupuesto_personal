import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido al Presupuesto Personal!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3436",
  },
});

export default HomePage;
