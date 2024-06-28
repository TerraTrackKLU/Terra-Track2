import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { GET_USER } from "../constants/links";
import { LinearGradient } from "expo-linear-gradient";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    username: "",
    profilePic: "",
    about: "", // Yeni alan eklendi
  });

  const fetchUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const response = await axios.get(GET_USER, {
        headers: { userid: userId },
      });
      setUser({
        name: response.data.name,
        surname: response.data.surname,
        username: response.data.nickname,
        profilePic:
          response.data.profilePic ||
          "https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png",
        about: response.data.about, // "Hakkında" kısmı eklendi
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      console.log("Çıkış yapıldı, veriler silindi: token, userId");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: "center", marginTop: 20 }}>
          <View style={styles.profileImage}>
            <Image
              source={{ uri: user.profilePic }}
              style={styles.image}
              resizeMode="center"
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>
            {user.name} {user.surname}
          </Text>
          <Text style={[styles.text, { color: "#AEB5BC", fontSize: 18 }]}>
            @{user.username}
          </Text>
        </View>

        <LinearGradient
          colors={["#e0eafc", "#cfdef3"]}
          style={styles.aboutContainer}
        >
          <Text style={styles.aboutText}>{user.about}</Text>
        </LinearGradient>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MyRoutes")}
          >
            <Text style={styles.buttonText}>Rotalarım</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MyFavorites")}
          >
            <Text style={styles.buttonText}>Favoriler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("MyPosts")}
          >
            <Text style={styles.buttonText}>Postlarım</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  text: {
    color: "#52575D",
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16,
  },
  aboutContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  aboutText: {
    color: "#52575D",
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  editButton: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#03dac6",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#6200ee",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Profile;
