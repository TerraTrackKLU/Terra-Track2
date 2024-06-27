import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { GET_USER, UPDATE_USER } from "../constants/links";
import { setUser } from "../redux/slices/userSlice";

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("");
  const [about, setAbout] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png"
  );

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(GET_USER, {
          headers: {
            userid: user._id,
          },
        });
        const userData = response.data;
        setName(userData.name);
        setSurname(userData.surname);
        setNickname(userData.nickname);
        setAbout(userData.about);
        setProfilePic(userData.profilePic);
      } catch (error) {
        console.error(error);
      }
    };

    if (user && user._id) {
      fetchUserProfile();
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Hata", "Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      const updatedUser = {
        name,
        surname,
        nickname,
        about,
        currentPassword,
        newPassword,
        profilePic,
      };

      console.log("Updated User Data:", updatedUser);

      const response = await axios.put(UPDATE_USER, updatedUser, {
        headers: {
          userid: user._id,
        },
      });

      if (response.data.error) {
        Alert.alert("Hata", response.data.error);
        return;
      }

      const updatedUserData = {
        ...user,
        name,
        surname,
        nickname,
        about,
        profilePic,
      };

      dispatch(setUser({ user: updatedUserData }));
      Alert.alert("Başarılı", "Değişiklikler kaydedildi.");
      navigation.navigate("Profile");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Hata", "Mevcut şifre yanlış!!");
    }
  };

  const handleChooseNewProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.profilePicContainer}
          onPress={handleChooseNewProfilePic}
        >
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
          <Text style={styles.changeProfilePicText}>
            Profil Resmini Değiştir
          </Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Name"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            value={surname}
            onChangeText={(text) => setSurname(text)}
            placeholder="Surname"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nickname</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={(text) => setNickname(text)}
            placeholder="Nickname"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hakkınızda</Text>
          <TextInput
            style={[styles.input, styles.aboutInput]}
            value={about}
            onChangeText={(text) => setAbout(text)}
            placeholder="Hakkınızda"
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mevcut Şifre</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
            placeholder="Mevcut Şifre"
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Yeni Şifre</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="Yeni Şifre"
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Yeni Şifre Tekrar</Text>
          <TextInput
            style={styles.input}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
            placeholder="Yeni Şifre Tekrar"
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 20,
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changeProfilePicText: {
    color: "#6200ee",
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  aboutInput: {
    height: 100,
  },
  saveButton: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProfile;
