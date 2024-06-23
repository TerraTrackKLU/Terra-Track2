import axios from "axios";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { saveToken } from "../events/auth";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { LOGIN } from "../constants/links";

const Login = ({ navigation }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const onPressLogin = async () => {
    const { email, password } = state;

    const requestBody = {
      email,
      password
    };


    await axios.post(LOGIN, requestBody).then(async (res) => {

      await saveToken(res.data.token);
      // dispatch(setUser({ user }));
      Alert.alert('Başarılı', 'Giriş başarılı!', [{ text: 'Tamam', onPress: () => navigation.navigate('Home') }]);

    })
      .catch((error) => {
        if (error.response) {
          // Sunucudan gelen hata yanıtı
          console.error('Error response:', error.response.data);

          // error.response.data.message bir dizi olup olmadığını kontrol et
          if (Array.isArray(error.response.data.message)) {
            error.response.data.message.forEach(msg => {
              console.error('Error message:', msg);
              alert(`Error: ${msg}`);
            });
          } else {
            console.error('Error message:', error.response.data.message);
            alert(`Error: ${error.response.data.message}`);
          }
        } else if (error.request) {
          // İstek gönderildi, ancak yanıt alınamadı
          console.error('Error request:', error.request);
        } else {
          // Başka bir hata oluştu
          console.error('Error:', error.message);
        }

      })
  };

  const onPressForgotPassword = () => {
    navigation.navigate('Forgot Password');
  };

  const onPressSignUp = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Email"
          mode="outlined"
          onChangeText={(text) => setState({ ...state, email: text })}
          theme={{ colors: { primary: '#6200ee' } }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Password"
          mode="outlined"
          secureTextEntry
          onChangeText={(text) => setState({ ...state, password: text })}
          theme={{ colors: { primary: '#6200ee' } }}
        />
      </View>

      <TouchableOpacity onPress={onPressForgotPassword}>
        <Text style={styles.forgotButton}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressSignUp} style={styles.signupButton}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
  },
  forgotButton: {
    color: "#6200ee",
    fontSize: 14,
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  signupButton: {
    width: "100%",
    backgroundColor: "#03dac6",
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

export default Login;
