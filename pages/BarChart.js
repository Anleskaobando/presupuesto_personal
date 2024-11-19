import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

const GraficoScreen = ({ montosPorMes }) => {
  let screerwidth = Dimensions.get("window").width;
  return (
    <View style={styles.container}>
      <BarChart
        data={montosPorMes}
        width={screerwidth - screerwidth * 0.1}
        height={300}
        chartConfig={{
          backgroundGradientFrom: "#00FFFF",
          backgroundGradientFromOpacity: 0.1,
          backgroundGradientTo: "#FFFFFF",
          backgroundGradientToOpacity: 1,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          strokeWidth: 1,
        }}
        style={{
          borderRadius: 16,
        }}
        verticalLabelRotation={45}
        withHorizontalLabels={true}
        showValuesOnTopOfBars={true}
        fromZero
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
