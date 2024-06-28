import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants/links';

const MyRoutes = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found');
          return;
        }
        const response = await axios.get(`${BASE_URL}/routes/user/${userId}`);
        setRoutes(response.data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  const handlePostShare = (route) => {
    navigation.navigate('PostShare', { route });
  };

  return (
    <ScrollView style={styles.container}>
      {routes.map((item) => (
        <View key={item._id} style={styles.card}>
          <TouchableOpacity onPress={() => navigation.navigate('RouteDetail', { routeId: item._id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.routeName}>{item.routeName}</Text>
              <Text style={styles.activityType}>{item.activityType}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>Mesafe</Text>
                <Text style={styles.detailValue}>{item.distance}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>İrtifa Kazancı</Text>
                <Text style={styles.detailValue}>{item.elevationGain}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailTitle}>Tur</Text>
                <Text style={styles.detailValue}>{item.laps}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => handlePostShare(item)}
          >
            <Text style={styles.postButtonText}>Post Paylaş</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 10,
  },
  routeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  activityType: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  divider: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  postButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyRoutes;
