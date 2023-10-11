import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ADMIN, USER } from '../contansts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LandingPage = ({ navigation }) => {

    const onAdminLogin = async () => {
        const userData = await AsyncStorage.getItem('adminLogin');
        if (userData) {
            navigation.replace('AdminHomeScreen')
        } else {
            navigation.navigate('Login', { type: ADMIN })
        }
    }
    const onUserLogin = async () => {
        const userData = await AsyncStorage.getItem('userLogin');
        if (userData) {
            navigation.replace('UserHomeScreen')
        } else {
            navigation.navigate('Login', { type: USER })
        }
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60", width: 200, height: 200 }} />
            <Text style={{ color: 'black', fontSize: 20 }}>Welcome to Here!!</Text>
            <View style={{ flexDirection: 'row', gap: 10, }}>
                <TouchableOpacity style={{ backgroundColor: 'red', height: 50, width: 120, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }} onPress={onAdminLogin}>
                    <Text style={{ fontSize: 18, color: 'white' }}>Admin Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: 'red', height: 50, width: 120, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }} onPress={onUserLogin}>
                    <Text style={{ fontSize: 18, color: 'white' }}>User Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 10,

    }
});

export default LandingPage;