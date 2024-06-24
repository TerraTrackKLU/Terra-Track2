import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import axios from "axios";
import { REGISTER } from "../constants/links";

const Register = ({ navigation }) => {
  const [state, setState] = useState({
    name: "",
    surname: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleDayChange = (text) => {
    setDay(text);
  };

  const handleMonthChange = (text) => {
    setMonth(text);
  };

  const handleYearChange = (text) => {
    setYear(text);
  };

  const onPressSignUp = async () => {
    console.log('asdlşkaskld')
    const birthDate = `${year}-${month}-${day}`;
    const { name, surname, nickname, email, password } = state;

    const requestBody = {
      name,
      surname,
      nickname,
      email,
      password,
      birthDate
    };

    await axios.post(REGISTER, requestBody).then((res) => {
      Alert.alert('Başarılı', 'Kayıt başarılı!', [{ text: 'Tamam', onPress: () => navigation.navigate('Login') }]);
      console.log(res)

    })
      .catch((error) => {
        console.log("hata geldi")
        Alert.alert('Hata', error.response.data.message);
      })


  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Name"
          mode="outlined"
          onChangeText={(text) => setState({ ...state, name: text })}
          theme={{ colors: { primary: '#6200ee' } }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Surname"
          mode="outlined"
          onChangeText={(text) => setState({ ...state, surname: text })}
          theme={{ colors: { primary: '#6200ee' } }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Username"
          mode="outlined"
          onChangeText={(text) => setState({ ...state, nickname: text })}
          theme={{ colors: { primary: '#6200ee' } }}
        />
      </View>

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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          label="Confirm Password"
          mode="outlined"
          secureTextEntry
          onChangeText={(text) => setState({ ...state, confirmPassword: text })}
          theme={{ colors: { primary: '#6200ee' } }}
        />
      </View>

      <View style={styles.birthContainer}>
        <Text style={styles.birthLabel}>Birth Date:</Text>
        <View style={styles.birthInputContainer}>
          <TextInput
            style={styles.birthInput}
            placeholder="DD"
            maxLength={2}
            keyboardType="numeric"
            value={day}
            onChangeText={handleDayChange}
            theme={{ colors: { primary: '#6200ee' } }}
          />
          <Text style={styles.birthSeparator}>/</Text>
          <TextInput
            style={styles.birthInput}
            placeholder="MM"
            maxLength={2}
            keyboardType="numeric"
            value={month}
            onChangeText={handleMonthChange}
            theme={{ colors: { primary: '#6200ee' } }}
          />
          <Text style={styles.birthSeparator}>/</Text>
          <TextInput
            style={styles.birthInput}
            placeholder="YYYY"
            maxLength={4}
            keyboardType="numeric"
            value={year}
            onChangeText={handleYearChange}
            theme={{ colors: { primary: '#6200ee' } }}
          />
        </View>
      </View>

      <TouchableOpacity onPress={onPressSignUp} style={styles.signUpButton}>
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
    borderRadius: 8,
  },
  birthContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  birthLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666",
  },
  birthInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  birthInput: {
    width: 70,
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  birthSeparator: {
    fontSize: 18,
  },
  signUpButton: {
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

export default Register;
