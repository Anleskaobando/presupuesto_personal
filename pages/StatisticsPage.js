import React, { useEffect, useState } from "react";
import { db } from "../services/Firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import GraficoScreen from "./BarChart";

const StatisticsPage = () => {
  const [montosPorMes, setMontosPorMes] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  // Función para obtener y procesar los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "PresupuestoInicial"));
        const querySnapshot = await getDocs(q);

        const meses = [];
        const montos = [];

        querySnapshot.forEach((doc) => {
          const { FechaInicio, PresupuestoDestinado } = doc.data();

          // Verifica que los datos necesarios existan
          if (FechaInicio && PresupuestoDestinado) {
            // Convierte el timestamp largo en un objeto Date
            const fechaObjeto = new Date(FechaInicio.seconds * 1000);

            // Formatea la fecha al estilo "mes-año"
            const mesAnio = `${
              fechaObjeto.getMonth() + 1
            }-${fechaObjeto.getFullYear()}`;

            // Agrupa montos por mes
            const index = meses.indexOf(mesAnio);
            if (index !== -1) {
              // Suma al monto existente
              montos[index] += PresupuestoDestinado;
            } else {
              // Agrega un nuevo mes con su monto
              meses.push(mesAnio);
              montos.push(PresupuestoDestinado);
            }
          } else {
            console.warn("Documento con datos incompletos:", doc.data());
          }
        });

        // Actualiza el estado con el formato requerido por el gráfico
        setMontosPorMes({
          labels: meses,
          datasets: [{ data: montos }],
        });

        console.log({ labels: meses, datasets: [{ data: montos }] });
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Header />
        <GraficoScreen montosPorMes={montosPorMes} />
      </ScrollView>
    </View>
  );
};

// Componente Header
const Header = () => (
  <View style={styles.header}>
    <Image
      source={require("../assets/analitica.gif")}
      style={styles.gif}
      contentFit="contain"
    />
    <Text style={styles.title}>Estadísticas</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
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
});

export default StatisticsPage;
