import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMIN, USER } from '../contansts';

const Login = ({ navigation, route }) => {
    const { type } = route.params
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        let storedUserData = null
        if (!username || !password) {
            Alert.alert('Enter both username and password')
            return;
        }
        try {
            if (type === ADMIN) {
                storedUserData = await AsyncStorage.getItem('admin_users');
            } else if (type === USER) {
                storedUserData = await AsyncStorage.getItem('users');
            }
            if (storedUserData) {
                const parsedUserData = JSON.parse(storedUserData);
                if (
                    username === parsedUserData.username &&
                    password === parsedUserData.password
                ) {
                    setError('');
                    Alert.alert('Success', 'Sign-in successful!');
                    if (type === ADMIN) {
                        AsyncStorage.setItem('adminLogin', storedUserData);
                        navigation.replace('AdminHomeScreen')
                    } else if (type === USER) {
                        AsyncStorage.setItem('userLogin', storedUserData);
                        navigation.replace('UserHomeScreen')
                    }
                } else {
                    Alert.alert('Invalid username or password');
                }
            } else {
                Alert.alert('No user data found');
            }
        } catch (error) {
            Alert.alert('An error occurred while signing in');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Sign In</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={styles.input}
            />
            <TouchableOpacity style={{ backgroundColor: 'red', height: 50, width: 120, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }} onPress={handleSignIn}>
                <Text style={{ fontSize: 18, color: 'white' }}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp', { type })} >
                <Text style={{ color: 'blue', marginTop: '10%' }}>Don't have Account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: '10%'
    },
    input: {
        width: '90%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
});

export default Login;