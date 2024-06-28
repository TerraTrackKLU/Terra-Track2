import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../constants/links";

const UserProfile = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileResponse = await axios.get(
          `${BASE_URL}/auth/get-user`,
          {
            headers: { userid: userId },
          }
        );
        setUser(userProfileResponse.data);

        const userPostsResponse = await axios.get(
          `${BASE_URL}/posts/user-posts/${userId}`
        );
        setPosts(userPostsResponse.data);
      } catch (error) {
        console.error("Error fetching user profile and posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
        <Text style={styles.name}>
          {user.name} {user.surname}
        </Text>
        <Text style={styles.username}>@{user.nickname}</Text>
      </View>
      <View style={styles.aboutContainer}>
        <Text style={styles.aboutTitle}>Hakkında</Text>
        <Text style={styles.aboutText}>{user.about}</Text>
      </View>
      <View style={styles.postsContainer}>
        <Text style={styles.postsTitle}>Gönderiler</Text>
        {posts.map((post) => (
          <TouchableOpacity
            key={post._id}
            onPress={() =>
              navigation.navigate("PostDetail", { postId: post._id })
            }
          >
            <View style={styles.post}>
              <Image
                source={{ uri: post.images[0] }}
                style={styles.postImage}
              />
              <Text style={styles.postTitle}>{post.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  username: {
    fontSize: 18,
    color: "#666",
  },
  aboutContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: "#666",
  },
  postsContainer: {
    marginHorizontal: 20,
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  post: {
    marginBottom: 20,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default UserProfile;
