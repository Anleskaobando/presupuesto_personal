import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import StackNavigator from "./navigation/StackNavigator";

const AppInitializer = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      SourGummy: require("./assets/fonts/SourGummy.ttf"),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <StackNavigator />;
};

export default AppInitializer;
