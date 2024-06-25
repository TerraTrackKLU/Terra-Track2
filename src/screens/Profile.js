import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserProfileUrl } from "../constants/links";

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({ name: "", surname: "", username: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileUrl = await getUserProfileUrl();
        console.log('User Profile URL:', userProfileUrl);
        const response = await axios.get(userProfileUrl, {
          headers: { userid: await AsyncStorage.getItem("userId") }
        });
        setUser({
          name: response.data.name,
          surname: response.data.surname,
          username: response.data.nickname,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

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
            <Image source={require("../Images/profile-pic.jpg")} style={styles.image} resizeMode="center" />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{user.name} {user.surname}</Text>
          <Text style={[styles.text, { color: "#AEB5BC", fontSize: 18 }]}>@{user.username}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
            <Text style={[styles.text, { fontSize: 24 }]}>844</Text>
            <Text style={[styles.text, styles.subText]}>Followers</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
            <Text style={[styles.text, styles.subText]}>Following</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.buttonText}>Düzenle</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyRoutes')}>
            <Text style={styles.buttonText}>Rotalarım</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyFavorites')}>
            <Text style={styles.buttonText}>Favoriler</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyPosts')}>
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
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500",
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
