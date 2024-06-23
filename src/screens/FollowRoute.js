import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const FollowRoute = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [distanceToStart, setDistanceToStart] = useState(null);
    const [route, setRoute] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const startLocationUpdates = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            // Rota başlangıç noktasını kullanıcının konumunun 100 metre yakınına ayarlayın
            const newRoute = [
                { latitude: location.coords.latitude + 0.001, longitude: location.coords.longitude + 0.001 },
                { latitude: location.coords.latitude + 0.0015, longitude: location.coords.longitude + 0.0015 },
                { latitude: location.coords.latitude + 0.002, longitude: location.coords.longitude + 0.002 },
            ];
            setRoute(newRoute);

            // Haritayı kullanıcı konumuna odaklayın
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Konumu her iki saniyede bir güncelle
            const locationUpdateInterval = setInterval(async () => {
                let updatedLocation = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: updatedLocation.coords.latitude,
                    longitude: updatedLocation.coords.longitude,
                });
            }, 2000);

            return () => clearInterval(locationUpdateInterval);
        };

        startLocationUpdates();
    }, []);

    useEffect(() => {
        if (userLocation && route.length > 0) {
            const start = route[0];
            const distance = getDistance(userLocation, start);
            setDistanceToStart(distance);
        }
    }, [userLocation, route]);

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
            >
                {route.map((point, index) => (
                    <Marker key={index} coordinate={point} />
                ))}
                <Polyline coordinates={route} strokeColor="#000" strokeWidth={3} />
                {userLocation && (
                    <Circle
                        center={userLocation}
                        radius={10}
                        strokeColor="rgba(0,0,255,0.5)"
                        fillColor="rgba(0,0,255,0.2)"
                    />
                )}
                {userLocation && route.length > 0 && (
                    <MapViewDirections
                        origin={userLocation}
                        destination={route[0]}
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
});

export default FollowRoute;
