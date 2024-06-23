import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { loadToken } from "../events/auth";
import { setUser } from "../redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      const isLoggedIn = await dispatch(loadToken());
      if (isLoggedIn) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("Login");
      }
    };

    initialize();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SplashScreen;
