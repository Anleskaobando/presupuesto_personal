import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import GastoComponent from "./GastoComponent";
import CardGastoComponent from "./CardGastoComponent";

const ListGastoComponent = ({ presupuestoId, onClose, onUpdate }) => {
  const [gastos, setGastos] = useState([]);
  const [editingGasto, setEditingGasto] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const cargarGastos = async () => {
    try {
      const q = query(
        collection(db, "Gastos"),
        where("PresupuestoId", "==", presupuestoId)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGastos(data);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    }
  };

  const eliminarGasto = async (gasto) => {
    try {
      await deleteDoc(doc(db, "Gastos", gasto.id));
      const presupuestoRef = doc(db, "PresupuestoInicial", presupuestoId);
      await updateDoc(presupuestoRef, {
        PresupuestoDestinado: increment(gasto.Monto),
      });
      alert("Gasto eliminado y presupuesto actualizado.");
      cargarGastos();
      onUpdate();
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
    }
  };

  const editarGasto = (gasto) => {
    setEditingGasto(gasto);
    setShowEditForm(true);
  };

  const cerrarEdicion = () => {
    setEditingGasto(null);
    setShowEditForm(false);
    cargarGastos();
    onUpdate();
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Gastos</Text>
        <Ionicons
          name="close-circle-outline"
          size={28}
          color="#f44336"
          onPress={onClose}
        />
      </View>

      {showEditForm && editingGasto ? (
        <GastoComponent
          presupuestoId={presupuestoId}
          gasto={editingGasto}
          onClose={cerrarEdicion}
          onSave={cerrarEdicion}
        />
      ) : (
        <>
          {gastos.length === 0 ? (
            <Text style={styles.emptyText}>No hay gastos registrados.</Text>
          ) : (
            <FlatList
              data={gastos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardGastoComponent
                  gasto={item}
                  onEdit={editarGasto}
                  onDelete={eliminarGasto}
                />
              )}
              style={styles.list}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "SourGummy",
    color: "#2d3436",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
    marginTop: 20,
  },
  list: {
    marginTop: 10,
  },
});

export default ListGastoComponent;
