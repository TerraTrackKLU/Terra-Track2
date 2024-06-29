import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBEiFr-BvP0OtvSMKqLxVUviO5hrMWx6cs';

const FollowRoute = () => {
    const routeParams = useRoute().params;
    const points = routeParams.points || []; // Parametre olarak gelen points dizisini al
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [distanceToStart, setDistanceToStart] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [walkedRoute, setWalkedRoute] = useState([]);
    const mapRef = useRef(null);
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        const startLocationUpdates = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            setLocation(location);
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            // Haritayı kullanıcı konumuna odaklayın
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Konumu sürekli güncelle
            const sub = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 1000, // Her saniyede bir güncelle
                    distanceInterval: 1, // Konum değişikliklerini daha sık güncelle
                },
                (updatedLocation) => {
                    setUserLocation({
                        latitude: updatedLocation.coords.latitude,
                        longitude: updatedLocation.coords.longitude,
                    });
                    setHeading(updatedLocation.coords.heading);
                    if (isFollowing) {
                        setWalkedRoute(prevWalkedRoute => [...prevWalkedRoute, updatedLocation.coords]);
                    }
                }
            );

            return () => sub.remove();
        };

        startLocationUpdates();
    }, [isFollowing]);

    useEffect(() => {
        if (userLocation && points.length > 0) {
            const start = points[0];
            const distance = getDistance(userLocation, start);
            setDistanceToStart(distance);
        }
    }, [userLocation, points]);

    const getDistance = (loc1, loc2) => {
        const R = 6371e3; // metres
        const φ1 = loc1.latitude * Math.PI / 180;
        const φ2 = loc2.latitude * Math.PI / 180;
        const Δφ = (loc2.latitude - loc1.latitude) * Math.PI / 180;
        const Δλ = (loc2.longitude - loc1.longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance;
    };

    const handleFollow = () => {
        if (distanceToStart > 10) {
            Alert.alert('Error', 'You must be within 10 meters of the starting point to start following the route.');
            return;
        }
        setIsFollowing(!isFollowing);
    };

    const handleFinish = () => {
        setIsFollowing(false);
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                mapType="satellite" // Harita tipini uydu moduna geçirme
            >
                {points.map((point, index) => (
                    (index === 0 || index === points.length - 1) && <Marker key={index} coordinate={point} pinColor="red" />
                ))}
                <Polyline coordinates={points} strokeColor="#000" strokeWidth={6} />
                <Polyline coordinates={walkedRoute} strokeColor="green" strokeWidth={3} />
                {userLocation && (
                    <Circle
                        center={userLocation}
                        radius={10}
                        strokeColor="rgba(0,0,255,0.5)"
                        fillColor="rgba(0,0,255,0.2)"
                    />
                )}
                {userLocation && (
                    <Marker.Animated
                        coordinate={userLocation}
                        anchor={{ x: 0.5, y: 0.5 }}
                        style={{ transform: [{ rotate: `${heading}deg` }] }}
                    >
                        <View style={styles.userLocationMarker}>
                            <View style={styles.userLocationMarkerInner} />
                        </View>
                    </Marker.Animated>
                )}
                {userLocation && points.length > 0 && distanceToStart > 100 && (
                    <MapViewDirections
                        origin={userLocation}
                        destination={points[0]}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="red"
                    />
                )}
            </MapView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFollow}
                    disabled={distanceToStart > 10}
                >
                    <Text style={styles.buttonLabel}>
                        {isFollowing ? "Takibi Durdur" : "Takibi Başlat"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFinish}
                >
                    <Text style={styles.buttonLabel}>Takibi Sonlandır</Text>
                </TouchableOpacity>
            </View>
            {errorMsg ? <Text>{errorMsg}</Text> : null}
            {distanceToStart !== null && (
                <Text>Start noktasına mesafe: {distanceToStart.toFixed(2)} metre</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 3, // Haritanın daha küçük görünmesini sağlar
    },
    buttonContainer: {
        flex: 1, // Butonlar için boşluk bırakır
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#6200ee',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10, // Butonlar arasına boşluk ekler
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLabel: {
        color: 'white',
        fontSize: 14, // Buton metnini biraz küçült
    },
    userLocationMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userLocationMarkerInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'blue',
    },
});

export default FollowRoute;
