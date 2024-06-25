import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Picker } from "@react-native-picker/picker";
import { POST_SHARE } from "../constants/links";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

const PostShare = ({ navigation }) => {
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
  const [routeId, setRouteId] = useState(""); // Add this state

  const user = useSelector((state) => state.user.user);
  const route = useRoute();

  useEffect(() => {
    if (!user) {
      console.error("User not found in Redux store");
    } else {
      console.log("User ID from Redux store:", user._id);
    }

    if (route.params && route.params.route) {
      const { routeName, distance, difficulty, duration, routeType, description, _id } = route.params.route;
      setTitle(routeName);
      setDistance(distance);
      setDifficulty(difficulty);
      setDuration(duration);
      setRouteType(routeType);
      setDescription(description);
      setRouteId(_id); // Set the routeId
    }
  }, [user, route.params]);

  const handlePostShare = async () => {
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
      routeId, // Include the routeId in the post data
    };

    try {
      const response = await axios.post(POST_SHARE, postData);
      if (response.status === 201) {
        alert("Post başarıyla paylaşıldı!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Post paylaşma hatası:", error);
      console.log("Error response data:", error.response.data);
      alert("Post paylaşma sırasında bir hata oluştu.");
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
          <Image key={index} source={{ uri: image }} style={styles.image} />
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

      <TouchableOpacity style={styles.button} onPress={handlePostShare}>
        <Text style={styles.buttonText}>Post Paylaş</Text>
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
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
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

export default PostShare;
