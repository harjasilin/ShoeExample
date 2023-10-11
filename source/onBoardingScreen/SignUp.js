import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADMIN, USER } from '../contansts';
const SignUp = ({ navigation, route }) => {
    const { type } = route.params
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const isValidEmail = (email) => {
        const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return emailPattern.test(email);
    };

    const handleSignUp = async () => {
        if (!email || !username || !password || !confirmPassword) {
            Alert.alert('All fields are required');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Invalid email address');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Passwords do not match');
            return;
        }

        const user = {
            email,
            username,
            password,
        };

        try {
            const userData = JSON.stringify(user);
            if (type === ADMIN) {
                await AsyncStorage.setItem('admin_users', userData);
            } else if (type === USER) {
                await AsyncStorage.setItem('users', userData);
            }
            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            Alert.alert('Registration successful');
            navigation.navigate('Login', { type })
        } catch (error) {
            Alert.alert('An error occurred while registering');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Sign Up</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
            />
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
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry={true}
                style={styles.input}
            />
            <TouchableOpacity style={{ backgroundColor: 'red', height: 50, width: 120, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }} onPress={handleSignUp}>
                <Text style={{ fontSize: 18, color: 'white' }}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login', { type })} >
                <Text style={{ color: 'blue', marginTop: '10%' }}>Already have Account? Sign In</Text>
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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default SignUp;