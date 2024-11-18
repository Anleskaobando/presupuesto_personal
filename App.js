import "react-native-gesture-handler"; // Necesario para react-navigation
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator"; // Ajusta la ruta si es necesario

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
