import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const data = [
  {
    id: 1,
    routeName: 'Yürüyüş Rotası 1',
    activityType: 'Doğa Yürüyüşü',
    distance: '5 km',
    elevationGain: '200 m',
    laps: '3 tur',
    owner: {
      name: 'John Doe',
      profilePic: 'https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png',
      profileId: 1, // Profil sayfasına gitmek için kullanılacak ID
    },
  },
  {
    id: 2,
    routeName: 'Yürüyüş Rotası 2',
    activityType: 'Kamp',
    distance: '10 km',
    elevationGain: '500 m',
    laps: '5 tur',
    owner: {
      name: 'Jane Smith',
      profilePic: 'https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png',
      profileId: 2, // Profil sayfasına gitmek için kullanılacak ID
    },
  },
  {
    id: 3,
    routeName: 'Yürüyüş Rotası 1',
    activityType: 'Doğa Yürüyüşü',
    distance: '5 km',
    elevationGain: '200 m',
    laps: '3 tur',
    owner: {
      name: 'John Doe',
      profilePic: 'https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png',
      profileId: 1, // Profil sayfasına gitmek için kullanılacak ID
    },
  },
  {
    id: 4,
    routeName: 'Yürüyüş Rotası 2',
    activityType: 'Kamp',
    distance: '10 km',
    elevationGain: '500 m',
    laps: '5 tur',
    owner: {
      name: 'Jane Smith',
      profilePic: 'https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png',
      profileId: 2, // Profil sayfasına gitmek için kullanılacak ID
    },
  },
  {
    id: 5,
    routeName: 'Yürüyüş Rotası 1',
    activityType: 'Doğa Yürüyüşü',
    distance: '5 km',
    elevationGain: '200 m',
    laps: '3 tur',
    owner: {
      name: 'John Doe',
      profilePic: 'https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png',
      profileId: 1, // Profil sayfasına gitmek için kullanılacak ID
    },
  },
  {
    id: 6,
    routeName: 'Yürüyüş Rotası 2',
    activityType: 'Kamp',
    distance: '10 km',
    elevationGain: '500 m',
    laps: '5 tur',
    owner: {
      name: 'Jane Smith',
      profilePic: 'https://w7.pngwing.com/pngs/744/940/png-transparent-anonym-avatar-default-head-person-unknown-user-user-pictures-icon.png',
      profileId: 2, // Profil sayfasına gitmek için kullanılacak ID
    },
  },
  // Daha fazla rota ekleyin
];

const MyFav = ({ navigation }) => {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:3000/favorites/1'); // Kullanıcı ID'sine göre güncelleyin
        setFavorites(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);
  
  return (
    <ScrollView style={styles.container}>
      {data.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate('PostDetail', { routeId: item.id })}>
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
            <TouchableOpacity
              style={styles.owner}
              onPress={() => navigation.navigate('Profile', { profileId: item.owner.profileId })}
            >
              <Image source={{ uri: item.owner.profilePic }} style={styles.profilePic} />
              <Text style={styles.ownerName}>{item.owner.name}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ownerName: {
    color: '#333',
    fontSize: 16,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default MyFav;
