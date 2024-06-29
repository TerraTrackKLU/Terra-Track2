import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { Card, Avatar, Button as PaperButton } from "react-native-paper";
import { useSelector } from "react-redux";
import {
  LIKE_POST,
  POST_HOMEPAGE,
  UNLIKE_POST,
  BASE_URL,
} from "../constants/links";
import LikeButton from "../components/LikeButton";

const HomePage = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchFavorites();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(POST_HOMEPAGE);
      const updatedPosts = response.data.map((post) => ({
        ...post,
        likes: Array.isArray(post.likes) ? post.likes : [],
      }));
      updatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(updatedPosts);
      fetchUsers(updatedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/favorites/${user._id}`);
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchUsers = async (posts) => {
    const userIds = [...new Set(posts.map((post) => post.userId))];
    try {
      const userResponses = await Promise.all(
        userIds.map((id) =>
          axios.get(`${BASE_URL}/auth/get-user`, { headers: { userid: id } })
        )
      );
      const userMap = userResponses.reduce((map, response) => {
        map[response.data._id] = response.data;
        return map;
      }, {});
      setUsers(userMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    fetchFavorites();
  };

  const handleLike = async (postId) => {
    const postIndex = posts.findIndex((post) => post._id === postId);
    const post = posts[postIndex];
    const isLiked = post.likes.includes(user._id);

    const updatedPosts = [...posts];
    if (isLiked) {
      updatedPosts[postIndex] = {
        ...post,
        likes: post.likes.filter((id) => id !== user._id),
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
      console.error("Error liking/unliking post:", error);
      setPosts(posts);
    }
  };

  const handleFavorite = async (postId) => {
    const isFavorite = favorites.some((fav) => fav._id === postId);

    try {
      if (isFavorite) {
        await axios.delete(`${BASE_URL}/favorites/${user._id}/${postId}`);
        setFavorites(favorites.filter((fav) => fav._id !== postId));
        alert("Removed from favorites!");
      } else {
        await axios.post(`${BASE_URL}/favorites`, {
          userId: user._id,
          postId: postId,
        });
        setFavorites([...favorites, { _id: postId }]);
        alert("Added to favorites!");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Terra</Text>
          <Image source={require("../Images/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Track</Text>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post) => {
          const postUser = users[post.userId];
          const isFavorite = favorites.some((fav) => fav._id === post._id);
          return (
            <Card key={post._id} style={styles.card}>
              <View style={styles.cardHeader}>
                {postUser && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("UserProfile", {
                        userId: post.userId,
                      })
                    }
                    style={styles.userInfo}
                  >
                    <Avatar.Image
                      size={40}
                      source={{ uri: postUser.profilePic }}
                    />
                    <Text style={styles.userName}>
                      {postUser.name} {postUser.surname}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PostDetail", { postId: post._id })
                }
              >
                <Card.Cover
                  source={{ uri: post.images[0] }}
                  style={styles.postImage}
                />
              </TouchableOpacity>
              <Card.Content>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.caption}>{post.description}</Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <LikeButton
                  isLiked={post.likes.includes(user._id)}
                  onPress={() => handleLike(post._id)}
                  likeCount={post.likes.length}
                />
                <PaperButton
                  icon={
                    isFavorite ? "bookmark-remove-outline" : "bookmark-outline"
                  }
                  onPress={() => handleFavorite(post._id)}
                >
                  {isFavorite ? "Remove Favorite" : "Add Favorite"}
                </PaperButton>
              </Card.Actions>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6200ee",
  },
  backgroundAnimation: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  postImage: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  caption: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  cardActions: {
    justifyContent: "space-between",
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
    alignSelf: "center",
    marginTop: 30,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "rgba(0, 128, 0, 0)",
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
