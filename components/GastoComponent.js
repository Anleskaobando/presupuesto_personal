import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  addDoc,
  collection,
  Timestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "../services/Firebase";

const GastoComponent = ({ presupuestoId, onClose, onSave, gasto = null }) => {
  const [categoria, setCategoria] = useState(gasto?.Categoria || "Comida");
  const [descripcion, setDescripcion] = useState(gasto?.Descripcion || "");
  const [monto, setMonto] = useState(gasto?.Monto?.toString() || "");
  const [fecha, setFecha] = useState(gasto?.Fecha?.toDate() || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const categorias = [
    { label: "Comida", icon: "fast-food-outline", color: "#FF5733" },
    { label: "Ropa", icon: "shirt-outline", color: "#33C4FF" },
    { label: "Fiesta", icon: "wine-outline", color: "#C70039" },
    { label: "Otros", icon: "ellipsis-horizontal-outline", color: "#28B463" },
  ];

  const guardarGasto = async () => {
    if (!categoria || !descripcion || !monto || monto <= 0) {
      alert("Todos los campos son obligatorios y el monto debe ser mayor a 0.");
      return;
    }

    const montoActual = parseFloat(monto);
    const montoAnterior = gasto?.Monto || 0;

    try {
      if (gasto) {
        // Actualizar gasto existente
        const gastoRef = doc(db, "Gastos", gasto.id);
        await updateDoc(gastoRef, {
          Categoria: categoria,
          Descripcion: descripcion,
          Monto: montoActual,
          Fecha: Timestamp.fromDate(fecha),
        });

        // Ajustar presupuesto según la diferencia en el monto
        const presupuestoRef = doc(db, "PresupuestoInicial", presupuestoId);
        await updateDoc(presupuestoRef, {
          PresupuestoDestinado: increment(montoAnterior - montoActual),
        });
        alert("Gasto actualizado y presupuesto ajustado.");
      } else {
        // Crear nuevo gasto
        const nuevoGasto = {
          Categoria: categoria,
          Descripcion: descripcion,
          Monto: montoActual,
          Fecha: Timestamp.fromDate(fecha),
          PresupuestoId: presupuestoId,
        };
        await addDoc(collection(db, "Gastos"), nuevoGasto);

        // Reducir presupuesto por el monto del nuevo gasto
        const presupuestoRef = doc(db, "PresupuestoInicial", presupuestoId);
        await updateDoc(presupuestoRef, {
          PresupuestoDestinado: increment(-montoActual),
        });
        alert("Gasto añadido con éxito.");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error al guardar gasto:", error);
      alert("Ocurrió un error al guardar el gasto.");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {gasto ? "Editar Gasto" : "Añadir Gasto"}
        </Text>
        <Ionicons name="wallet-outline" size={24} color="#4CAF50" />
      </View>

      {/* Campo de Categoría */}
      <View style={styles.row}>
        <Ionicons name="pricetag-outline" size={20} color="#4CAF50" />
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.selectButtonText}>{categoria}</Text>
          <Ionicons name="chevron-down-outline" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar categoría */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
            <FlatList
              data={categorias}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCategoria(item.label);
                    setShowModal(false);
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={item.color}
                    style={styles.modalIcon}
                  />
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Campo de Descripción */}
      <View style={styles.row}>
        <Ionicons name="document-text-outline" size={20} color="#2196F3" />
        <TextInput
          style={styles.input}
          placeholder="Descripción (Ej. Compra comida rápida)"
          value={descripcion}
          onChangeText={setDescripcion}
        />
      </View>

      {/* Campo de Fecha */}
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={20} color="#FFA500" />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {fecha.toLocaleDateString("es-ES")}
          </Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFecha(selectedDate);
            }
          }}
        />
      )}

      {/* Campo de Monto */}
      <View style={styles.row}>
        <Ionicons name="cash-outline" size={20} color="#f44336" />
        <TextInput
          style={styles.input}
          placeholder="Monto (C$)"
          keyboardType="numeric"
          value={monto}
          onChangeText={(text) => setMonto(text.replace(/[^0-9]/g, ""))}
        />
      </View>

      {/* Botones */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={guardarGasto}>
          <Ionicons name="save-outline" size={24} color="#4CAF50" />
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.cancelButton]}
          onPress={onClose}
        >
          <Ionicons name="close-circle-outline" size={24} color="#f44336" />
          <Text style={styles.buttonText}>Cancelar</Text>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  selectButton: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
  },
  selectButtonText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "SourGummy",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "SourGummy",
    marginBottom: 10,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalIcon: {
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: "SourGummy",
    color: "#333",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontFamily: "SourGummy",
    color: "#555",
  },
  dateButton: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "SourGummy",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  iconButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#fdd",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "SourGummy",
    marginLeft: 5,
  },
});

export default GastoComponent;
