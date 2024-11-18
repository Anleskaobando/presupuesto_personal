import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import PresupuestoComponent from "../components/PresupuestoComponent";
import CardPresupuesto from "../components/CardPresupuesto";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db } from "../services/Firebase";

const HomePage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [showCrearPresupuesto, setShowCrearPresupuesto] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPresupuesto, setCurrentPresupuesto] = useState(null);

  // Función para cargar presupuestos desde Firestore
  const cargarPresupuestos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "PresupuestoInicial"));
      const data = querySnapshot.docs
        .map((doc) => {
          const presupuesto = doc.data();

          // Validar y convertir las fechas solo si existen y son Timestamps
          const FechaInicio =
            presupuesto.FechaInicio && presupuesto.FechaInicio.toDate
              ? presupuesto.FechaInicio.toDate()
              : null;
          const FechaFin =
            presupuesto.FechaFin && presupuesto.FechaFin.toDate
              ? presupuesto.FechaFin.toDate()
              : null;

          return {
            id: doc.id,
            ...presupuesto,
            FechaInicio,
            FechaFin,
          };
        })
        .sort((a, b) =>
          a.FechaInicio && b.FechaInicio ? a.FechaInicio - b.FechaInicio : 0
        );
      setPresupuestos(data);
    } catch (error) {
      console.error("Error al cargar presupuestos:", error);
    }
  };

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  // Función para guardar un presupuesto (nuevo o editado)
  const guardarPresupuesto = async (nuevoPresupuesto) => {
    if (!nuevoPresupuesto.FechaInicio || !nuevoPresupuesto.FechaFin) {
      alert("Por favor selecciona fechas válidas.");
      return;
    }

    if (
      !nuevoPresupuesto.PresupuestoDestinado ||
      nuevoPresupuesto.PresupuestoDestinado <= 0
    ) {
      alert("El monto destinado debe ser mayor a 0.");
      return;
    }

    if (!nuevoPresupuesto.Dias || nuevoPresupuesto.Dias <= 0) {
      alert("Los días deben ser mayores a 0.");
      return;
    }

    try {
      const presupuestoConTimestamps = {
        ...nuevoPresupuesto,
        FechaInicio: Timestamp.fromDate(new Date(nuevoPresupuesto.FechaInicio)),
        FechaFin: Timestamp.fromDate(new Date(nuevoPresupuesto.FechaFin)),
      };

      if (editMode) {
        await updateDoc(
          doc(db, "PresupuestoInicial", currentPresupuesto.id),
          presupuestoConTimestamps
        );
      } else {
        await addDoc(
          collection(db, "PresupuestoInicial"),
          presupuestoConTimestamps
        );
      }
      setShowCrearPresupuesto(false);
      cargarPresupuestos();
    } catch (error) {
      console.error("Error al guardar presupuesto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/limosna.gif")}
          style={styles.gif}
          contentFit="contain"
        />
        <Text style={styles.title}>Presupuesto Personal</Text>
      </View>

      {showCrearPresupuesto ? (
        <PresupuestoComponent
          presupuesto={currentPresupuesto}
          setPresupuesto={setCurrentPresupuesto}
          onSave={guardarPresupuesto}
          onClose={() => setShowCrearPresupuesto(false)}
          isEditing={editMode}
        />
      ) : (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditMode(false);
              setCurrentPresupuesto({
                FechaInicio: new Date(),
                FechaFin: new Date(),
                PresupuestoDestinado: "",
                Dias: "",
                Estado: true,
              });
              setShowCrearPresupuesto(true);
            }}
          >
            <Text style={styles.addButtonText}>Añadir Presupuesto</Text>
          </TouchableOpacity>

          <FlatList
            data={presupuestos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardPresupuesto
                presupuesto={item}
                onEdit={() => {
                  setEditMode(true);
                  setCurrentPresupuesto(item);
                  setShowCrearPresupuesto(true);
                }}
                onRefresh={cargarPresupuestos}
              />
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  gif: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: "SourGummy",
    color: "#2d3436",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomePage;
