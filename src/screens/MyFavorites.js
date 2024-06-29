import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { Card, Button as PaperButton, Avatar } from "react-native-paper";
import { useSelector } from 'react-redux';
import { BASE_URL } from "../constants/links";

const MyFavorites = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [users, setUsers] = useState({});
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/favorites/${user._id}`);
      const favoritePosts = response.data;
      setFavorites(favoritePosts);
      fetchUsers(favoritePosts);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUsers = async (posts) => {
    const userIds = [...new Set(posts.map(post => post.userId))];
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
    fetchFavorites();
  };

  const removeFromFavorites = async (postId) => {
    try {
      await axios.delete(`${BASE_URL}/favorites/${user._id}/${postId}`);
      console.log('Post favorilerden çıkarıldı.');
      alert('Favorilerden çıkarıldı!');
      fetchFavorites(); // Favoriler güncellendiği için yeniden fetch et
    } catch (error) {
      console.error('Error removing from favorites:', error);
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {favorites.length === 0 ? (
          <Text style={styles.noFavoritesText}>Favorilediğiniz post bulunmamaktadır</Text>
        ) : (
          favorites.map((post) => {
            const postUser = users[post.userId];
            return (
              <Card key={post._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  {postUser && (
                    <View style={styles.userInfo}>
                      <Avatar.Image size={40} source={{ uri: postUser.profilePic }} />
                      <Text style={styles.userName}>{postUser.name}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post._id })}>
                  <Card.Cover source={{ uri: post.images[0] }} style={styles.postImage} />
                </TouchableOpacity>
                <Card.Content>
                  <Text style={styles.title}>{post.title}</Text>
                  <Text style={styles.caption}>{post.description}</Text>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <PaperButton 
                    icon="bookmark-remove-outline" 
                    onPress={() => removeFromFavorites(post._id)}
                  >
                    Favorilerden Çıkar
                  </PaperButton>
                </Card.Actions>
              </Card>
            );
          })
        )}
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
  noFavoritesText: {
    textAlign: 'center',
    fontSize: 18,
    margin: 20,
    color: '#333',
  },
  card: {
    margin: 10,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  postImage: {
    marginTop: 10,
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
});

export default MyFavorites;
