import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

const CardPresupuesto = ({ presupuesto, onEdit, onDelete }) => {
  // Convertir fecha a una cadena legible en formato día-mes-año
  const convertirFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(fecha));
  };

  // Formatear monto con comas para los miles
  const formatearMonto = (monto) => {
    if (!monto) return "C$0";
    return `C$${monto.toLocaleString()}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Presupuesto: {formatearMonto(presupuesto.PresupuestoDestinado)}
        </Text>
        <Text style={styles.estado}>
          {presupuesto.Estado ? "🟢 Activo" : "🔴 Inactivo"}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.datesContainer}>
        <View style={styles.dateField}>
          <Ionicons name="calendar-outline" size={20} color="#4CAF50" />
          <Text style={styles.dateText}>
            Inicio: {convertirFecha(presupuesto.FechaInicio)}
          </Text>
        </View>
        <View style={styles.dateField}>
          <Ionicons name="calendar-outline" size={20} color="#f44336" />
          <Text style={styles.dateText}>
            Fin: {convertirFecha(presupuesto.FechaFin)}
          </Text>
        </View>
        <View style={styles.dateField}>
          <Ionicons name="time-outline" size={20} color="#FFA500" />
          <Text style={styles.dateText}>Duración: {presupuesto.Dias} días</Text>
        </View>
        <View style={styles.moneyBagContainer}>
          <Image
            source={require("../assets/bolsa.gif")}
            style={styles.moneyBag}
            contentFit="contain"
          />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "SourGummy",
    color: "#2d3436",
  },
  estado: {
    fontSize: 14,
    fontFamily: "SourGummy",
    color: "#2d3436",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  datesContainer: {
    flexDirection: "column",
    gap: 5,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: "SourGummy",
    color: "#555",
  },
  moneyBagContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  moneyBag: {
    width: 80,
    height: 80,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});

export default CardPresupuesto;
