import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import PresupuestoComponent from "../components/PresupuestoComponent";
import CardPresupuestoComponent from "../components/CardPresupuestoComponent";
import GastoComponent from "../components/GastoComponent";
import ListGastoComponent from "../components/ListGastoComponent";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/Firebase";

const HomePage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [showCrearPresupuesto, setShowCrearPresupuesto] = useState(false);
  const [showGastoForm, setShowGastoForm] = useState(false);
  const [showGastoList, setShowGastoList] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPresupuesto, setCurrentPresupuesto] = useState(null);
  const [selectedPresupuestoId, setSelectedPresupuestoId] = useState(null);
  const scaleAnim = new Animated.Value(1);

  // Función para cargar presupuestos desde Firestore
  const cargarPresupuestos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "PresupuestoInicial"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        FechaInicio: doc.data().FechaInicio?.toDate() || null,
        FechaFin: doc.data().FechaFin?.toDate() || null,
      }));
      setPresupuestos(
        data.sort((a, b) => (a.FechaInicio > b.FechaInicio ? 1 : -1))
      );
    } catch (error) {
      console.error("Error al cargar presupuestos:", error);
    }
  };

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  // Función para guardar un presupuesto
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

  // Función para eliminar un presupuesto
  const eliminarPresupuesto = async (id) => {
    try {
      await deleteDoc(doc(db, "PresupuestoInicial", id));
      cargarPresupuestos();
    } catch (error) {
      console.error("Error al eliminar presupuesto:", error);
    }
  };

  // Funciones para alternar entre vistas
  const abrirGastoForm = (presupuestoId) => {
    setSelectedPresupuestoId(presupuestoId);
    setShowGastoForm(true);
    setShowCrearPresupuesto(false);
    setShowGastoList(false);
  };

  const cerrarGastoForm = () => {
    setSelectedPresupuestoId(null);
    setShowGastoForm(false);
  };

  const abrirListaGastos = (presupuestoId) => {
    setSelectedPresupuestoId(presupuestoId);
    setShowGastoList(true);
    setShowCrearPresupuesto(false);
    setShowGastoForm(false);
  };

  const cerrarListaGastos = () => {
    setSelectedPresupuestoId(null);
    setShowGastoList(false);
  };

  const abrirCrearPresupuesto = () => {
    setEditMode(false);
    setCurrentPresupuesto({
      FechaInicio: new Date(),
      FechaFin: new Date(),
      PresupuestoDestinado: "",
      Dias: "",
      Estado: true,
    });
    setShowCrearPresupuesto(true);
    setShowGastoList(false);
    setShowGastoForm(false);
  };

  // Animación para el botón
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
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

      {showGastoForm && (
        <GastoComponent
          presupuestoId={selectedPresupuestoId}
          onClose={cerrarGastoForm}
          onSave={cargarPresupuestos}
        />
      )}

      {showCrearPresupuesto && (
        <PresupuestoComponent
          presupuesto={currentPresupuesto}
          setPresupuesto={setCurrentPresupuesto}
          onSave={guardarPresupuesto}
          onClose={() => setShowCrearPresupuesto(false)}
          isEditing={editMode}
        />
      )}

      {showGastoList && (
        <ListGastoComponent
          presupuestoId={selectedPresupuestoId}
          onClose={cerrarListaGastos}
          onUpdate={cargarPresupuestos}
        />
      )}

      {!showCrearPresupuesto && !showGastoForm && !showGastoList && (
        <>
          <Animated.View
            style={[
              styles.animatedButtonContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                animateButton();
                abrirCrearPresupuesto();
              }}
            >
              <Image
                source={require("../assets/mas.gif")}
                style={styles.addButtonIcon}
                contentFit="contain"
              />
            </TouchableOpacity>
          </Animated.View>

          <FlatList
            data={presupuestos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardPresupuestoComponent
                presupuesto={item}
                onEdit={() => {
                  setEditMode(true);
                  setCurrentPresupuesto(item);
                  setShowCrearPresupuesto(true);
                }}
                onDelete={() => eliminarPresupuesto(item.id)}
                onAddGasto={() => abrirGastoForm(item.id)}
                onShowGastos={() => abrirListaGastos(item.id)}
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
  animatedButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: 60,
    height: 60,
  },
  addButtonIcon: {
    width: 40,
    height: 40,
  },
});

export default HomePage;
