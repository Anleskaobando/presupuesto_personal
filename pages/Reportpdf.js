import React from "react";
import { View, Button, Alert, StyleSheet, Dimensions } from "react-native";
import { jsPDF } from "jspdf";
import * as FileSystem from "expo-file-system"; // Manejo de archivos
import * as Sharing from "expo-sharing";
import { BarChart } from "react-native-chart-kit";

const GraficoScreen = ({ montosPorMes }) => {
  const generarPDF = async () => {
    try {
      // Crear una instancia de jsPDF
      const doc = new jsPDF();

      // Agregar título al PDF
      doc.text("Reporte de Gastos", 10, 10);

      // Agregar los datos al PDF
      datamontosPorMes.labels.forEach((label, index) => {
        const Monto = datamontosPorMes.datasets[0].data[index];
        doc.text(`${label}: C$${Monto}`, 10, 20 + index * 10); // Formato de los datos
      });

      // Generar el PDF como base64
      const pdfBase64 = doc.output("datauristring").split(",")[1];

      // Definir la ruta temporal para el archivo PDF en el sistema de archivos del dispositivo
      const fileUri = `${FileSystem.documentDirectory}reporte_gasto.pdf`;

      // Guardar el archivo PDF
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el archivo PDF
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert("Error", "No se pudo generar o compartir el PDF.");
    }
  };

  let screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <BarChart
        data={montosPorMes}
        width={screenWidth - screenWidth * 0.1}
        height={300}
        yAxisLabel="C$"
        chartConfig={{
          backgroundGradientFrom: "#00FFFF",
          backgroundGradientFromOpacity: 0.1,
          backgroundGradientTo: "#FFFFFF",
          backgroundGradientToOpacity: 1,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          strokeWidth: 1,
          barPercentage: 0.5,
        }}
        style={{
          borderRadius: 10,
        }}
        verticalLabelRotation={45}
        withHorizontalLabels={true}
        showValuesOnTopOfBars={true}
      />

      <View style={styles.button}>
        <Button title="Generar y Compartir PDF" onPress={generarPDF} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 10,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
});
