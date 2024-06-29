import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert } from 'react-native';
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

    const validateInputs = () => {
        if (!routeName || !activityType || !distance || !elevationGain || !laps || !difficulty || !duration || !routeType) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
            return false;
        }
        return true;
    };

    const saveRoute = async () => {
        if (!validateInputs()) return;

        try {
            const response = await axios.post(SAVE_ROUTE, {
                routeName,
                activityType,
                distance: distance + ' km',
                elevationGain: elevationGain + ' m',
                laps,
                difficulty,
                duration: duration + ' saat',
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

    const handleNumberInput = (setter) => (value) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setter(value);
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
                onChangeText={handleNumberInput(setDistance)}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="İrtifa Kazancı (m)"
                value={elevationGain}
                onChangeText={handleNumberInput(setElevationGain)}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Tur Sayısı"
                value={laps}
                onChangeText={handleNumberInput(setLaps)}
                keyboardType="numeric"
            />
            <Picker
                selectedValue={difficulty}
                style={styles.picker}
                onValueChange={(itemValue) => setDifficulty(itemValue)}
            >
                <Picker.Item label="Zorluk Seçin" value="" />
                <Picker.Item label="Kolay" value="kolay" />
                <Picker.Item label="Kolay-Orta" value="kolay-orta" />
                <Picker.Item label="Orta" value="orta" />
                <Picker.Item label="Orta-Zor" value="orta-zor" />
                <Picker.Item label="Zor" value="zor" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Toplam Süre (saat)"
                value={duration}
                onChangeText={handleNumberInput(setDuration)}
                keyboardType="numeric"
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
