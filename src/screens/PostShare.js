import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
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
  const [activityType, setActivityType] = useState("");
  const [routeId, setRouteId] = useState("");

  const user = useSelector((state) => state.user.user);
  const route = useRoute();

  useEffect(() => {
    if (!user) {
      console.error("User not found in Redux store");
    } else {
      console.log("User ID from Redux store:", user._id);
    }

    if (route.params && route.params.route) {
      const { routeName, distance, difficulty, duration, routeType, description, _id, activityType } = route.params.route;

      setTitle(routeName);
      setDistance(distance);
      setDifficulty(difficulty);
      setDuration(duration);
      setRouteType(routeType);
      setDescription(description);
      setRouteId(_id);
      setActivityType(activityType); // Set the initial tag based on activityType
    }
  }, [user, route.params]);

  const handlePostShare = async () => {
    if (!user || !user._id) {
      alert("User ID not found");
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
      tags: [activityType], // Include the tag in the post data
      userId: user._id,
      date,
      routeId,
    };

    try {
      const response = await axios.post(POST_SHARE, postData);
      if (response.status === 201) {
        alert("Post successfully shared!!");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Post sharing error:", error);
      console.log("Error response data:", error.response.data);
      alert("An error occurred while sharing a post.");
    }
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      alert("You can add up to 3 images.");
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Content"
        placeholderTextColor="#888"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        placeholder="Mesafe"
        placeholderTextColor="#888"
        value={distance}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        placeholder="Zorluk"
        placeholderTextColor="#888"
        value={difficulty}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        placeholder="Toplam Süre"
        placeholderTextColor="#888"
        value={duration}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        placeholder="Rota Türü"
        placeholderTextColor="#888"
        value={routeType}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        placeholder="Aktivite Türü"
        placeholderTextColor="#888"
        value={activityType}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Add Image</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePostShare}>
        <Text style={styles.buttonText}>Post Share</Text>
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
  inputDisabled: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
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
});

export default PostShare;
