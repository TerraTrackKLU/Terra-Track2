import { View, Text } from "react-native";
import React from "react";
import WheelSpin from "../../react-native-wheel-spin";

const Cark = () => {
  const colors = [
    '#E07026',
    '#E8C22E',
    '#ABC937',
    '#4F991D',
    '#22AFD3',
  ];

  const texts = [
    'Selotaş',
    'kayıpbalık',
    'ibido',
    'aug',
    'yase',
  ];
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <WheelSpin colors={colors} texts={texts} />
    </View>
  );
};

export default Cark;
