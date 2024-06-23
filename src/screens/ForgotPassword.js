import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

const ForgotPassword = ({ navigation }) => {
  const [state, setState] = useState({
    email: "",
  });

  const onPressSend = () => {
    // Parola sıfırlama işlemi
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>You can reset your password using the code sent to your email.</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Email"
          mode="outlined"
          onChangeText={(text) => setState({ ...state, email: text })}
          theme={{ colors: { primary: '#6200ee' } }}
        />
      </View>

      <TouchableOpacity onPress={onPressSend} style={styles.sendButton}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  sendButton: {
    width: "100%",
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPassword;
