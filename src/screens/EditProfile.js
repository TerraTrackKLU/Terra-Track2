import React, { useState , useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const EdProf = () => {
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profilePic, setProfilePic] = useState('https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/1'); // Kullanıcı ID'sine göre güncelleyin
        const user = response.data;
        setUsername(user.username);
        setAbout(user.about);
        setProfilePic(user.profilePic);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  
  const handleSaveChanges = async () => {
    try {
      const updatedUser = {
        username,
        about,
        currentPassword,
        newPassword: newPassword === confirmNewPassword ? newPassword : undefined,
        profilePic,
      };

      const response = await axios.put('http://localhost:3000/users/1', updatedUser); // Kullanıcı ID'sine göre güncelleyin
      Alert.alert('Başarılı', 'Değişiklikler kaydedildi.');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Değişiklikler kaydedilirken bir hata oluştu.');
    }
  };

  const handleChooseNewProfilePic = async () => {
    // Expo ImagePicker kullanarak yeni profil resmi seç
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.profilePicContainer} onPress={handleChooseNewProfilePic}>
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
          <Text style={styles.changeProfilePicText}>Profil Resmini Değiştir</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Kullanıcı Adı</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(text) => setUsername(text)}
            placeholder="Kullanıcı Adı"
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
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changeProfilePicText: {
    color: '#6200ee',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  aboutInput: {
    height: 100,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EdProf;
