import { View, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

const GraficoScreen = ({ montosPorMes }) => {
  let screerwidth = Dimensions.get("window").width;
  return (
    <View style={styles.container}>
      <BarChart
        montosPorMes={montosPorMes}
        width={screerwidth - screerwidth * 0.1}
        height={300}
        yAxisLabel="$"
        chartConfig={{
          backgroundGradientFrom: "#e26a00 (220, 0, 0, 0,0.1)",
          backgroundGradientFromOpacity: 0.1,
          backgroundGradientTo: "#ffa726 (220, 0, 0, 0,0.1)",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          strokeWidth: 2,
          barPercentage: 0.5,
          fillShadowGradient: "#FF4444",
          fillShadowGradientOpacity: 1,
        }}
        style={{
          borderRadius: 16,
        }}
        verticalLabelRotation={45}
        withHorizontalLabels={true}
        showValuesOnTopOfBars={true}
      />
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

export default GraficoScreen;
