import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import AppInitializer from "./AppInitializer";

export default function App() {
  return (
    <NavigationContainer>
      <AppInitializer />
    </NavigationContainer>
  );
}
