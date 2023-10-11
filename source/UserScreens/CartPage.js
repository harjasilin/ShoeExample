import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartPage = ({ navigation }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const loadCart = async () => {
            const storedCart = await loadCartFromStorage();
            if (storedCart) {
                setCart(storedCart);
            }
        };
        navigation.addListener('focus', () => {
            loadCart();
        });
        loadCart()
    }, [navigation]);

    const loadCartFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('cart');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {

        }
    };
    const handleDeleteFromCart = (item) => {
        const deletedcart = cart.filter((itm) => itm.id != item.id)
        setCart(deletedcart)
        saveCartToStorage(deletedcart)
    };

    const saveCartToStorage = async (cartData) => {
        try {
            const jsonValue = JSON.stringify(cartData);
            await AsyncStorage.setItem('cart', jsonValue);
        } catch (e) {

        }
    };
    const onPayment = async() => {
        navigation.push('UserHomeScreen')
        await AsyncStorage.removeItem('cart');
        Alert.alert("Payment Sucessful")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Shoes Cart</Text>
            <ScrollView style={styles.shoeContainer} >
                {cart.map((shoe, index) => (
                    <View key={index} style={{ elevation: 1, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding:10 , marginVertical:5}} >
                        <View style={{flexDirection:'row'}}>
                            <Image
                                source={{ uri: shoe.imageURL }}
                                style={styles.shoeImage}
                            />
                            <View>
                            <Text style={styles.shoeText}>{shoe.brand}</Text>
                            <Text style={styles.shoeText}>Cost: ${shoe.cost}</Text>
                            <Text style={styles.shoeText}>Size: {shoe.selectedSize}</Text>
                            </View>
                        </View>
                            <TouchableOpacity onPress={() => handleDeleteFromCart(shoe)} style={[styles.buttonStyles, {backgroundColor:'#fff', }]}>
                            <Image
                                source={{ uri: 'data:image/png;base64,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' }}
                                style={{height:25, width:25}}
                            />
                            </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            {cart.length === 0 ? (
                <View style={{ marginTop: '50%' }}>
                    <Text style={{ ...styles.buttonText, color: '#f00' }} >Cart is Empty</Text>
                </View>
            ) : (
                <TouchableOpacity onPress={onPayment} style={{...styles.buttonStyles, width:'95%'}}>
                    <Text style={styles.buttonText}>Make Payment</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
        textDecorationLine: 'underline'
    },
    buttonStyles: {
        backgroundColor: 'blue',
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf:'center',
        paddingVertical: 10,
        paddingHorizontal:10,
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
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    shoeText: {
        fontSize: 16,
        marginBottom: 5,
        margin: 2
    },
});

export default CartPage;