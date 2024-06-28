import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from "react-native";
import axios from "axios";
import { Avatar, Card, Button as PaperButton, IconButton } from "react-native-paper";
import { useSelector } from "react-redux";
import { BASE_URL, LIKE_POST, UNLIKE_POST } from "../constants/links";
import LikeButton from "../components/LikeButton";

const MyPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchPosts();
    fetchFavorites();
  }, [user]);

  const fetchPosts = async () => {
    if (!user || !user._id) {
      console.error("User ID bulunamadı");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/posts/user/${user._id}`);
      const updatedPosts = response.data.map(post => ({
        ...post,
        likes: Array.isArray(post.likes) ? post.likes : [],
      })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Tarihe göre sıralama
      setPosts(updatedPosts);
      fetchUsers(updatedPosts); // Kullanıcı verilerini çekmek için çağır
    } catch (error) {
      console.error('Error fetching posts:', error);
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
    const userIds = [...new Set(posts.map(post => post.userId))]; // Postlardan kullanıcı ID'lerini topla ve benzersiz olanları al
    try {
      const userResponses = await Promise.all(userIds.map(id => axios.get(`${BASE_URL}/auth/get-user`, { headers: { userid: id } })));
      const userMap = userResponses.reduce((map, response) => {
        map[response.data._id] = response.data;
        return map;
      }, {});
      setUsers(userMap);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    fetchFavorites();
  };

  const handleLike = async (postId) => {
    const postIndex = posts.findIndex(post => post._id === postId);
    const post = posts[postIndex];
    const isLiked = post.likes.includes(user._id);

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
      setPosts(posts);
    }
  };

  const handleFavorite = async (postId) => {
    const isFavorite = favorites.some((fav) => fav._id === postId);

    try {
      if (isFavorite) {
        await axios.delete(`${BASE_URL}/favorites/${user._id}/${postId}`);
        setFavorites(favorites.filter((fav) => fav._id !== postId));
        alert("Favorilerden çıkarıldı!");
      } else {
        await axios.post(`${BASE_URL}/favorites`, {
          userId: user._id,
          postId: postId,
        });
        setFavorites([...favorites, { _id: postId }]);
        alert("Favorilere eklendi!");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleDeletePost = (postId) => {
    Alert.alert(
      "Postu Sil",
      "Bu postu silmek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Sil",
          onPress: async () => {
            try {
              await axios.delete(`${BASE_URL}/posts/${postId}`);
              setPosts(posts.filter((post) => post._id !== postId));
              alert("Post silindi!");
            } catch (error) {
              console.error("Error deleting post:", error);
              alert("Post silinirken bir hata oluştu.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleUpdatePost = (postId) => {
    Alert.alert(
      "Postu Güncelle",
      "Bu postu güncellemek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Güncelle",
          onPress: () => {
            navigation.navigate('PostUpdate', { postId });
          }
        }
      ]
    );
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
                  <View style={styles.userInfo}>
                    <Avatar.Image size={40} source={{ uri: postUser.profilePic }} />
                    <Text style={styles.userName}>{postUser.name}</Text>
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  <IconButton
                    icon="pencil"
                    onPress={() => handleUpdatePost(post._id)}
                  />
                  <IconButton
                    icon="delete"
                    onPress={() => handleDeletePost(post._id)}
                    color="red"
                  />
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post._id })}>
                <Card.Cover source={{ uri: post.images[0] }} style={styles.postImage} />
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
                  icon={isFavorite ? "bookmark-remove-outline" : "bookmark-outline"}
                  onPress={() => handleFavorite(post._id)}
                >
                  {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ee',
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  postImage: {
    marginTop: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  caption: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardActions: {
    justifyContent: 'space-between',
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
