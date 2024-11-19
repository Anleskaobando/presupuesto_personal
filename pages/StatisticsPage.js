import React, { useEffect, useState } from "react";
import { db } from "../services/Firebase";
import GraficoScreen from "./BarChart";
import { collection, query, getDocs } from "firebase/firestore";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

const StatisticsPage = () => {
  const [montosPorMes, setMontosPorMes] = useState(null);

  useEffect(() => {
    const obtenerPresupuesto = async () => {
      try {
        const q = query(collection(db, "PresupuestoInicial"));
        const querySnapshot = await getDocs(q);

        const montosPorMes = {};

        querySnapshot.forEach((doc) => {
          const { Fecha, Monto } = doc.data();

          if (Fecha && Monto) {
            const fechaObjeto = new Date(Fecha.seconds * 1000);
            const mesAnio = `${
              fechaObjeto.getMonth() + 1
            }-${fechaObjeto.getFullYear()}`;

            if (!montosPorMes[mesAnio]) {
              montosPorMes[mesAnio] = 0;
            }
            montosPorMes[mesAnio] += Monto;
          }
        });

        const labels = Object.keys(montosPorMes);
        const dataCounts = Object.values(montosPorMes);

        setMontosPorMes({
          labels,
          datasets: [
            {
              label: "Montos por Mes",
              data: dataCounts,
            },
          ],
        });
      } catch (error) {
        console.error(
          "Error al obtener los datos de PresupuestoInicial:",
          error
        );
      }
    };

    obtenerPresupuesto();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/analitica.gif")}
          style={styles.gif}
          contentFit="contain"
        />
        <Text style={styles.title}>Estadísticas</Text>
      </View>
      <GraficoScreen montosPorMes={setMontosPorMes} />
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
});

export default StatisticsPage;
