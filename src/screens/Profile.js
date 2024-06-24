import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from "react-native";
import { Octicons } from '@expo/vector-icons';
import EdProf from "./EditProfile";
import axios from 'axios';


export default function Profile({ navigation }) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://172.20.10.2:5000/terra-track/api/users/1`); // Kullanıcı ID'sine göre güncelleyin
        setUsername(response.data.username);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: "center", marginTop: 20 }}>
          <View style={styles.profileImage}>
            <Image source={require("../Images/profile-pic.jpg")} style={styles.image} resizeMode="center" />
          </View>
          {/* <TouchableOpacity style={styles.add}>
            <Octicons name="upload" size={24} color="white" style={{ marginTop: 6, marginLeft: 2 }} />
          </TouchableOpacity> */}
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{username}</Text> 
          {/* <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>Photographer</Text> */}
        </View>

        <View style={styles.statsContainer}>
          {/* <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>3</Text>
            <Text style={[styles.text, styles.subText]}>Posts</Text>
          </View> */}
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

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  text: {
    fontFamily: "HelveticaNeue",
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
  add: {
    backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
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
});

