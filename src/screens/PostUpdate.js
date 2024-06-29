import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "../constants/links";
import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";  // İkon için import

const PostUpdate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [distance, setDistance] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("");
  const [routeType, setRouteType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tag, setTag] = useState("");

  const user = useSelector((state) => state.user.user);
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/${postId}`);
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setDistance(post.distance);
        setDifficulty(post.difficulty);
        setDuration(post.duration);
        setRouteType(post.routeType);
        setDescription(post.description);
        setImages(post.images);
        setSelectedTags(post.tags);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleUpdatePost = async () => {
    if (!user || !user._id) {
      alert("User ID bulunamadı");
      return;
    }

    const date = new Date().toISOString();
    const postData = {
      title,
      content,
      distance,
      difficulty,
      duration,
      routeType,
      description,
      images,
      tags: selectedTags,
      userId: user._id,
      date,
    };

    try {
      const response = await axios.put(`${BASE_URL}/posts/${postId}`, postData);
      if (response.status === 200) {
        alert("Post başarıyla güncellendi!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Post güncelleme hatası:", error);
      alert("Post güncelleme sırasında bir hata oluştu.");
    }
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      alert("En fazla 3 resim ekleyebilirsiniz.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      if (typeof imageUri !== "string") {
        console.error("Picked Image URI is not a string");
        return;
      }

      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 800, height: 600 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        if (typeof manipResult.uri !== "string") {
          console.error("Manipulated Image URI is not a string");
          return;
        }

        const response = await fetch(manipResult.uri);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages([...images, reader.result]);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Resim yeniden boyutlandırma hatası:", error);
      }
    }
  };

  const handleDeleteImage = (index) => {
    Alert.alert(
      "Resmi Sil",
      "Bu resmi silmek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Sil",
          onPress: () => {
            setImages(images.filter((_, i) => i !== index));
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleTagChange = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < 2) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      alert("En fazla 2 etiket seçebilirsiniz.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Başlık"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="İçerik"
        placeholderTextColor="#888"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Mesafe"
        placeholderTextColor="#888"
        value={distance}
        onChangeText={setDistance}
      />
      <TextInput
        style={styles.input}
        placeholder="Zorluk"
        placeholderTextColor="#888"
        value={difficulty}
        onChangeText={setDifficulty}
      />
      <TextInput
        style={styles.input}
        placeholder="Toplam Süre"
        placeholderTextColor="#888"
        value={duration}
        onChangeText={setDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Rota Türü"
        placeholderTextColor="#888"
        value={routeType}
        onChangeText={setRouteType}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Açıklama"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Resim Ekle</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDeleteImage(index)}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Etiket Seç:</Text>
      <Picker
        selectedValue={tag}
        style={styles.picker}
        onValueChange={(itemValue) => {
          if (selectedTags.includes(itemValue)) {
            setSelectedTags(selectedTags.filter((t) => t !== itemValue));
          } else if (selectedTags.length < 2) {
            setSelectedTags([...selectedTags, itemValue]);
          } else {
            alert("En fazla 2 etiket seçebilirsiniz.");
          }
          setTag(itemValue);
        }}
      >
        <Picker.Item label="Seçiniz" value="" />
        <Picker.Item label="Yürüyüş" value="yürüyüş" />
        <Picker.Item label="Kamp" value="kamp" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleUpdatePost}>
        <Text style={styles.buttonText}>Post Güncelle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default PostUpdate;
