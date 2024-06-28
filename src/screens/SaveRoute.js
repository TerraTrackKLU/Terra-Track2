import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SAVE_ROUTE } from '../constants/links';
import { Picker } from '@react-native-picker/picker';

const SaveRoute = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { points } = route.params;

    const [routeName, setRouteName] = useState('');
    const [activityType, setActivityType] = useState('');
    const [distance, setDistance] = useState('');
    const [elevationGain, setElevationGain] = useState('');
    const [laps, setLaps] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [duration, setDuration] = useState('');
    const [routeType, setRouteType] = useState('');
    const [owner, setOwner] = useState('');

    useEffect(() => {
        const fetchOwner = async () => {
            const userId = await AsyncStorage.getItem('userId');
            setOwner(userId);
        };

        fetchOwner();
        console.log(points);
    }, []);

    const saveRoute = async () => {
        try {
            const response = await axios.post(SAVE_ROUTE, {
                routeName,
                activityType,
                distance,
                elevationGain,
                laps,
                difficulty,
                duration,
                routeType,
                owner,
                points,
            });
            console.log('Route saved successfully', response.data);
            navigation.goBack();
        } catch (error) {
            console.error('Error saving route', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Rota Kaydet</Text>
            <TextInput
                style={styles.input}
                placeholder="Rota İsmi"
                value={routeName}
                onChangeText={setRouteName}
            />
            <Picker
                selectedValue={activityType}
                style={styles.picker}
                onValueChange={(itemValue) => setActivityType(itemValue)}
            >
                <Picker.Item label="Aktivite Türü Seçin" value="" />
                <Picker.Item label="Yürüyüş" value="yürüyüş" />
                <Picker.Item label="Kamp" value="kamp" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Mesafe (km)"
                value={distance}
                onChangeText={setDistance}
            />
            <TextInput
                style={styles.input}
                placeholder="İrtifa Kazancı (m)"
                value={elevationGain}
                onChangeText={setElevationGain}
            />
            <TextInput
                style={styles.input}
                placeholder="Tur Sayısı"
                value={laps}
                onChangeText={setLaps}
            />
            <TextInput
                style={styles.input}
                placeholder="Zorluk"
                value={difficulty}
                onChangeText={setDifficulty}
            />
            <TextInput
                style={styles.input}
                placeholder="Toplam Süre (saat)"
                value={duration}
                onChangeText={setDuration}
            />
            <TextInput
                style={styles.input}
                placeholder="Rota Türü"
                value={routeType}
                onChangeText={setRouteType}
            />
            <Button title="Kaydet" onPress={saveRoute} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 15,
    },
});

export default SaveRoute;
