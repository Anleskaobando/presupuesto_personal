import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { iniciarSesionconFirebase } from "../services/auth";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    const result = await iniciarSesionconFirebase(email, password);

    if (result.success) {
      Alert.alert("Bienvenido", `Hola, ${result.user.Nombre}`);
      navigation.navigate("Main");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/chanchito.gif")}
        style={styles.gif}
        contentFit="contain"
      />

      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Gestiona tu presupuesto personal</Text>

      {/* Campos de texto */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botón */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gif: {
    width: 150,
    height: 150,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#636e72",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    elevation: 2,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#0984e3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginPage;
