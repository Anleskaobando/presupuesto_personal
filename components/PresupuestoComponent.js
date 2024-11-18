import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { Switch } from "react-native-switch";

const PresupuestoComponent = ({
  presupuesto,
  setPresupuesto,
  onSave,
  onClose,
  isEditing,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Cálculo automático de días entre FechaInicio y FechaFin
  useEffect(() => {
    if (presupuesto.FechaInicio && presupuesto.FechaFin) {
      const fechaInicio = new Date(presupuesto.FechaInicio);
      const fechaFin = new Date(presupuesto.FechaFin);
      const diferenciaEnMs = fechaFin - fechaInicio;
      const dias = Math.ceil(diferenciaEnMs / (1000 * 60 * 60 * 24));

      if (dias >= 0) {
        setPresupuesto((prev) => ({
          ...prev,
          Dias: dias,
        }));
      } else {
        alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
        setPresupuesto((prev) => ({
          ...prev,
          FechaFin: prev.FechaInicio,
          Dias: 0,
        }));
      }
    }
  }, [presupuesto.FechaInicio, presupuesto.FechaFin]);

  const handleDateChange = (field, event, selectedDate) => {
    if (selectedDate) {
      setPresupuesto((prev) => ({
        ...prev,
        [field]: selectedDate,
      }));
    }
    if (field === "FechaInicio") setShowStartPicker(false);
    if (field === "FechaFin") setShowEndPicker(false);
  };

  const handleDateDisplay = (fecha) => {
    if (!fecha) return "Seleccionar";
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(fecha));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Editar Presupuesto" : "Nuevo Presupuesto"}
      </Text>

      {/* Selector de Fecha de Inicio */}
      <View style={styles.row}>
        <Text style={styles.label}>Fecha Inicio:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {handleDateDisplay(presupuesto.FechaInicio)}
          </Text>
        </TouchableOpacity>
      </View>
      {showStartPicker && (
        <DateTimePicker
          value={new Date(presupuesto.FechaInicio || Date.now())}
          mode="date"
          display="default"
          onChange={(event, date) =>
            handleDateChange("FechaInicio", event, date)
          }
        />
      )}

      {/* Selector de Fecha de Fin */}
      <View style={styles.row}>
        <Text style={styles.label}>Fecha Fin:</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {handleDateDisplay(presupuesto.FechaFin)}
          </Text>
        </TouchableOpacity>
      </View>
      {showEndPicker && (
        <DateTimePicker
          value={new Date(presupuesto.FechaFin || Date.now())}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange("FechaFin", event, date)}
        />
      )}

      {/* Input de Monto Destinado */}
      <View style={styles.row}>
        <Text style={styles.label}>Monto:</Text>
        <TextInput
          style={styles.input}
          placeholder="C$"
          keyboardType="numeric"
          value={presupuesto.PresupuestoDestinado?.toString() || ""}
          onChangeText={(text) =>
            setPresupuesto((prev) => ({
              ...prev,
              PresupuestoDestinado: Number(text),
            }))
          }
        />
      </View>

      {/* Campo de Días */}
      <View style={styles.row}>
        <Text style={styles.label}>Días:</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          placeholder="0"
          keyboardType="numeric"
          value={presupuesto.Dias?.toString() || ""}
          editable={false}
        />
      </View>

      {/* Switch de Estado */}
      <View style={styles.row}>
        <Text style={styles.label}>Estado:</Text>
        <Switch
          value={presupuesto.Estado}
          onValueChange={(value) =>
            setPresupuesto((prev) => ({
              ...prev,
              Estado: value,
            }))
          }
          circleSize={24}
          barHeight={18}
          backgroundActive="#FFC107"
          backgroundInactive="#E0E0E0"
          circleActiveColor="#FF5722"
          circleInactiveColor="#9E9E9E"
          renderActiveText={false}
          renderInActiveText={false}
        />
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSave(presupuesto)}
        >
          <Icon name={isEditing ? "edit" : "save"} size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {isEditing ? "Actualizar" : "Guardar"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onClose}
        >
          <Icon name="times-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "SourGummy",
    marginBottom: 20,
    textAlign: "center",
    color: "#2d3436",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: "SourGummy",
    color: "#2d3436",
    flex: 1,
  },
  dateButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#555",
    fontFamily: "SourGummy",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    fontFamily: "SourGummy",
    flex: 2,
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#aaa",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "SourGummy",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default PresupuestoComponent;
