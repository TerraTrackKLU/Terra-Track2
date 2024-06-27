import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import { Appbar, Avatar, Card, Button as PaperButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { BASE_URL, LIKE_POST, UNLIKE_POST } from "../constants/links";

const MyPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(`${BASE_URL}/posts/user/${user._id}`);
          const updatedPosts = response.data.map(post => ({
            ...post,
            likes: Array.isArray(post.likes) ? post.likes : [],
          })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Tarihe göre sıralama
          setPosts(updatedPosts);
        } else {
          console.error("User ID bulunamadı");
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user]);

  const handleLike = async (postId) => {
    const postIndex = posts.findIndex(post => post._id === postId);
    const post = posts[postIndex];
    const isLiked = post.likes.includes(user._id);

    // Optimistik UI güncellemesi
    const updatedPosts = [...posts];
    if (isLiked) {
      updatedPosts[postIndex] = {
        ...post,
        likes: post.likes.filter(id => id !== user._id),
      };
    } else {
      updatedPosts[postIndex] = {
        ...post,
        likes: [...post.likes, user._id],
      };
    }
    setPosts(updatedPosts);

    try {
      if (isLiked) {
        await axios.post(UNLIKE_POST + postId, { userId: user._id });
      } else {
        await axios.post(LIKE_POST + postId, { userId: user._id });
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);

      // Hata durumunda UI güncellemesini geri al
      setPosts(posts);
    }
  };

  const handleComment = (postId) => {
    navigation.navigate('PostDetail', { postId, focusComment: true });
  };

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
              <PaperButton 
                icon={post.likes.includes(user._id) ? "heart" : "heart-outline"} 
                color={post.likes.includes(user._id) ? "red" : undefined} 
                onPress={() => handleLike(post._id)}
              >
                Like {post.likes.length}
              </PaperButton>
              <PaperButton icon="comment-outline" onPress={() => handleComment(post._id)}>Comment</PaperButton>
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
