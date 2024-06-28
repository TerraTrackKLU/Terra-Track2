import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../constants/links';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RouteDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { routeId, postId } = route.params;

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        let response;
        if (routeId) {
          response = await axios.get(`${BASE_URL}/routes/${routeId}`);
        } else if (postId) {
          response = await axios.get(`${BASE_URL}/posts/${postId}`);
        }
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    const getUserIdAndName = async () => {
      const id = await AsyncStorage.getItem('userId');
    };

    fetchPost();
    getUserIdAndName();
  }, [routeId, postId]);

  const handleFollowRoute = () => {
    navigation.navigate('Map');
  };

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {post.images && post.images.length > 0 ? (
        post.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))
      ) : (
        <View style={styles.mapErrorContainer}>
          <Text style={styles.mapErrorText}>Harita yüklenmedi</Text>
        </View>
      )}
      <View style={styles.contentContainer}>
        <Button mode="contained" onPress={handleFollowRoute} style={styles.followButton}>
          Rotayı Takip Et
        </Button>
        <View style={styles.tagsContainer}>
          {post.tags && post.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <Text style={styles.title}>{post.routeName || post.title}</Text>
        <Text style={styles.date}>{post.date}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Mesafe</Text>
            <Text style={styles.detailValue}>{post.distance}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Zorluk</Text>
            <Text style={styles.detailValue}>{post.difficulty}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Toplam Süre</Text>
            <Text style={styles.detailValue}>{post.duration}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Rota Türü</Text>
            <Text style={styles.detailValue}>{post.routeType}</Text>
          </View>
        </View>
        <Text style={styles.description}>{post.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  followButton: {
    marginBottom: 20,
    backgroundColor: '#6200ee',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#03dac6',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapErrorContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  mapErrorText: {
    fontSize: 16,
    color: '#666',
  },
});

export default RouteDetail;
