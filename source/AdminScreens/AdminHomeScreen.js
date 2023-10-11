import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminHomeScreen = ({ navigation }) => {
    const [shoes, setShoes] = useState([]);

    useEffect(() => {
        const loadShoes = async () => {
            const storedShoes = await loadShoesFromStorage();
            if (storedShoes) {
                setShoes(storedShoes);
            }
        };
        navigation.addListener('focus', () => {
            loadShoes();
        });
        loadShoes();
    }, [navigation]);

    const handleEditShoe = (shoedata) => {
        navigation.navigate('AddShoe', { shoedata })
    };

    const handleDeleteShoe = (index) => {
        const updatedShoes = [...shoes];
        updatedShoes.splice(index, 1);
        setShoes(updatedShoes);
        saveShoesToStorage(updatedShoes);
    };

    const saveShoesToStorage = async (shoesData) => {
        try {
            const jsonValue = JSON.stringify(shoesData);
            await AsyncStorage.setItem('shoes', jsonValue);
        } catch (e) {
            console.error('Error saving data to AsyncStorage:', e);
        }
    };

    const loadShoesFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('shoes');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {

        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('adminLogin')
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
                <Text style={styles.header}>Shoe Management</Text>
                <TouchableOpacity style={{ margin: 10, }} onPress={handleLogout}>
                    <Image source={{ uri: 'data:image/png;base64,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' }}
                        style={{ height: 20, width: 20 }} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('AddShoe', { shoedata: null })} style={styles.buttonStyles}>
                <Text style={styles.buttonText}>Add Shoe</Text>
            </TouchableOpacity>
            {shoes.length === 0 && <View style={{ marginTop: '50%' }}>
                <Text style={{ ...styles.buttonText, color: '#f00' }} >Shoe list is empty</Text>
            </View>}
            <ScrollView style={styles.shoeContainer} >
                {shoes.map((shoe, index) => (
                    <View key={index} style={{ elevation: 1, borderWidth: 2, marginVertical:5 }} >
                        <Image
                            source={{ uri: shoe.imageURL }}
                            style={styles.shoeImage}
                        />
                        <Text style={styles.shoeText}>{shoe.brand}</Text>
                        <Text style={styles.shoeText}>Cost: ${shoe.cost}</Text>
                        <Text style={styles.shoeText}>Sizes: {shoe.sizes.join(', ')}</Text>

                        <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'center', marginBottom: 10 }}>
                            <TouchableOpacity style={{ backgroundColor: 'blue', height: 30, width: 80, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => handleEditShoe(shoe)} >
                                <Text style={{ fontSize: 12, color: 'white' }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'red', height: 30, width: 80, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }} onPress={() => handleDeleteShoe(index)}>
                                <Text style={{ fontSize: 12, color: 'white' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        textDecorationLine: 'underline',
    },
    buttonStyles: {
        backgroundColor: 'red',
        alignContent: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#fff'
    },
    shoeContainer: {
        marginVertical: 10,
    },
    shoeImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    shoeText: {
        fontSize: 15,
        marginBottom: 5,
        color: 'black',
        fontWeight: '500'
    },
});

export default AdminHomeScreen;