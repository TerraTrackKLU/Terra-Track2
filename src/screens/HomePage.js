import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import { Appbar, Card, Button as PaperButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { POST_HOMEPAGE } from "../constants/links";

const HomePage = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(POST_HOMEPAGE);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const addToFavorites = async (postId) => {
    try {
      await axios.post(`http://172.20.10.2:5000/terra-track/api/favorites`, { userId: user._id, postId });
      console.log('Post favorilere eklendi.');
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Home" />
        <Appbar.Action icon="magnify" onPress={() => { }} />
        <Appbar.Action icon="message" onPress={() => { }} />
      </Appbar.Header>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Terra</Text>
          <Image source={require("../Images/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Track</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.postButton} onPress={() => navigation.navigate("PostShare")}>
        <Text style={styles.postButtonText}>Post Paylaş</Text>
      </TouchableOpacity>

      <ScrollView>
        {posts.map((post) => (
          <Card key={post._id} style={styles.card}>
            <Card.Title
              title={post.title}
              subtitle={post.routeType}
            />
            <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post._id })}>
              <Card.Cover source={{ uri: post.images[0] }} />
            </TouchableOpacity>
            <Card.Content>
              <Text style={styles.caption}>{post.description}</Text>
            </Card.Content>
            <Card.Actions>
              <PaperButton icon="heart-outline" onPress={() => addToFavorites(post._id)}>Like</PaperButton>
              <PaperButton icon="comment-outline" onPress={() => navigation.navigate('PostDetail', { postId: post._id })}>Comment</PaperButton>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
  caption: {
    marginTop: 10,
  },
  feedContainer: {
    display: "flex",
  },
  logo: {
    width: 40,
    height: 32,
  },
  logoText: {
    height: 35,
    fontSize: 20,
    top: 3,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  logoContainer: {
    width: "70%",
    height: 40,
    backgroundColor: "green",
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  postButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomePage;
