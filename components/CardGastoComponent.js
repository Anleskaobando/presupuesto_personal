import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CardGastoComponent = ({ gasto, onEdit, onDelete }) => {
  const formatearMonto = (monto) => `C$${monto.toLocaleString()}`;
  const formatearFecha = (fecha) =>
    new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(fecha.toDate()));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconoCategoria}>
          <Ionicons
            name={
              gasto.Categoria === "Comida"
                ? "fast-food-outline"
                : gasto.Categoria === "Ropa"
                ? "shirt-outline"
                : gasto.Categoria === "Fiesta"
                ? "wine-outline"
                : "ellipsis-horizontal-outline"
            }
            size={24}
            color="#4CAF50"
          />
        </View>
        <Text style={styles.categoria}>{gasto.Categoria}</Text>
      </View>
      <Text style={styles.descripcion}>{gasto.Descripcion}</Text>
      <Text style={styles.monto}>{formatearMonto(gasto.Monto)}</Text>
      <Text style={styles.fecha}>{formatearFecha(gasto.Fecha)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(gasto)}>
          <Ionicons name="create-outline" size={24} color="#FFA500" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(gasto)}>
          <Ionicons name="trash-outline" size={24} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconoCategoria: {
    marginRight: 10,
  },
  categoria: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  descripcion: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  monto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f44336",
  },
  fecha: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
});

export default CardGastoComponent;
