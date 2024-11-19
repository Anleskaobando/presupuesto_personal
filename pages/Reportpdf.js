import { useRef } from "react";
import { captureRef } from "react-native-view-shot";
import { View, Button, Alert, StyleSheet, Dimensions } from "react-native";
import { jsPDF } from "jspdf";
import * as FileSystem from "expo-file-system"; // Manejo de archivos
import * as Sharing from "expo-sharing";
import { BarChart } from "react-native-chart-kit";

export default function GraficoScreen({ montosPorMes }) {
  const screenWidth = Dimensions.get("window").width;
  const chartRef = useRef();
  const generarPDF = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
        width: screenWidth - screenWidth * 0.1,
        height: 300,
      });

      const doc = new jsPDF();
      doc.text("Reporte con datos", 10, 10);
      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(
        `data:image/png;base64,${chartImage}`,
        "PNG",
        10,
        20,
        180,
        90
      );

      montosPorMes.labels.forEach((label, index) => {
        const valor = montosPorMes.datasets[0].data[index];
        doc.text(`${label}: C$${valor}`, 10, 120 + index * 10);
      });

      const pdfBase64 = doc.output("datauristring").split(",")[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_filtrado.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert("Error", "No se pudo generar o compartir el PDF.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cont}>
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
      </View>
      <View style={styles.button}>
        <Button title="Generar y Compartir PDF" onPress={generarPDF} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
  },
  cont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    flex: 1,
    marginTop: 10,
  },
});
