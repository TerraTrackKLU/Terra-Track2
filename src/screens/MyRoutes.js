import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants/links';

const MyRoutes = ({ navigation }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${BASE_URL}/routes/user/${userId}`);
        setRoutes(response.data);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handlePostShare = (route) => {
    navigation.navigate('PostShare', { route });
  };

  const handleDeleteRoute = async (routeId) => {
    Alert.alert(
      "Rota Sil",
      "Bu rotayı silmek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Evet",
          onPress: async () => {
            try {
              await axios.delete(`${BASE_URL}/routes/${routeId}`);
              setRoutes(routes.filter(route => route._id !== routeId));
            } catch (error) {
              console.error('Error deleting route:', error);
              Alert.alert('Hata', 'Rota silinirken bir hata oluştu.');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

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
      {routes.length === 0 ? (
        <View style={styles.noRoutesContainer}>
          <Text style={styles.noRoutesText}>Henüz hiç rota kaydetmediniz.</Text>
        </View>
      ) : (
        routes.map((item) => (
          <TouchableOpacity key={item._id} onPress={() => navigation.navigate('RouteDetail', { routeId: item._id })}>
            <View style={styles.card}>
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
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.postButton}
                  onPress={() => handlePostShare(item)}
                >
                  <Text style={styles.postButtonText}>Post Paylaş</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteRoute(item._id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
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
  noRoutesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noRoutesText: {
    fontSize: 18,
    color: '#666',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    color: '#6200ee',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textTransform: 'capitalize',
    alignSelf: 'flex-start',
  },
  deleteButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  postButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyRoutes;
