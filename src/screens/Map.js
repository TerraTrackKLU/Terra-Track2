import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Map = () => {
  const [locationState, setLocationState] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [recording, setRecording] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Sayfa odağa geldiğinde yapılacak işlemler
      return () => {
        // Sayfa odağını kaybettiğinde yapılacak işlemler
        if (subscription) {
          subscription.remove();
          setSubscription(null);
          setRecording(false);
        }
      };
    }, [subscription])
  );

  const startRecording = async () => {
    setRecording(true);
    const sub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
      (location) => {
        setLocationState(location.coords);
        setMarkers((prevMarkers) => [...prevMarkers, location.coords]);
      }
    );
    setSubscription(sub);
  };

  const pauseRecording = () => {
    setRecording(false);
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setMarkers([]);
  };

  const navigateToSaveRoute = () => {
    if (markers.length > 0) {
      navigation.navigate('SaveRoute', { points: markers });
    } else {
      alert("Markers array is empty!");
    }
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
        <Polyline coordinates={markers} strokeColor="#000" strokeWidth={6} />
      </MapView>
      <View style={styles.buttonsContainer}>
        {!recording ? (
          <Button title="Start" onPress={startRecording} />
        ) : (
          <Button title="Pause" onPress={pauseRecording} />
        )}
        <Button title="Reset" onPress={stopRecording} />
        <Button title="Finish The Walk" onPress={navigateToSaveRoute} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Map;
