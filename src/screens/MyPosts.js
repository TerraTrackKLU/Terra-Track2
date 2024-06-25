import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import { Appbar, Avatar, Card, Button as PaperButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants/links"; // BASE_URL'i burada kullanacağız

const MyPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(`${BASE_URL}/posts/user/${user._id}`);
          setPosts(response.data);
        } else {
          console.error("User ID bulunamadı");
        }
      } catch (error) {
        console.error('Error fetching posts:', error); // Hata durumunu loglayın
      }
    };

    fetchPosts();
  }, [user]);

  return (
    <View style={styles.container}>
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
              <PaperButton icon="heart-outline" onPress={() => { }}>Like</PaperButton>
              <PaperButton icon="comment-outline" onPress={() => { }}>Comment</PaperButton>
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

export default MyPosts;
