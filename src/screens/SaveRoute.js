import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SAVE_ROUTE } from '../constants/links';

const SaveRoute = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { points } = route.params;

    const [routeName, setRouteName] = useState('');
    const [activityType, setActivityType] = useState('');
    const [distance, setDistance] = useState('');
    const [elevationGain, setElevationGain] = useState('');
    const [laps, setLaps] = useState('');
    const [owner, setOwner] = useState('');

    useEffect(() => {


        console.log(points)
    }, [])


    const saveRoute = async () => {
        try {
            const response = await axios.post(SAVE_ROUTE, {
                routeName,
                activityType,
                distance,
                elevationGain,
                laps,
                owner: '666c97d9b56689bfd35469d9',
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
            <TextInput
                style={styles.input}
                placeholder="Aktivite Türü"
                value={activityType}
                onChangeText={setActivityType}
            />
            <TextInput
                style={styles.input}
                placeholder="Mesafe"
                value={distance}
                onChangeText={setDistance}
            />
            <TextInput
                style={styles.input}
                placeholder="İrtifa Kazancı"
                value={elevationGain}
                onChangeText={setElevationGain}
            />
            <TextInput
                style={styles.input}
                placeholder="Tur Sayısı"
                value={laps}
                onChangeText={setLaps}
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
});

export default SaveRoute;
