import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SIZES } from '../contansts';

const UserHomeScreen = ({ navigation }) => {
    const [shoes, setShoes] = useState([]);
    const [cart, setCart] = useState([]);

    const loadShoes = async () => {
        const storedShoes = await loadShoesFromStorage();
        if (storedShoes) {
            storedShoes.map((itm) => itm.selectedSize = itm.sizes[0])
            setShoes(storedShoes);
        }
    };
    const loadCart = async () => {
        const storedCart = await loadCartFromStorage()
        if (storedCart) {
            setCart(storedCart);
        }
    };

    useEffect(() => {

        navigation.addListener('focus', () => {
            loadShoes();
            loadCart();
        });
        loadCart()
        loadShoes();
    }, [navigation]);

    const handleAddToCart = (item) => {
        const filteredcart = cart.filter((itm) => itm.id === item.id)
        if (filteredcart.length === 0) {
            setCart((prev) => [...prev, item])
            saveCartToStorage([...cart, item])
        } else {
            const deletedcart = cart.filter((itm) => itm.id != item.id)
            setCart(deletedcart)
            saveCartToStorage(deletedcart)
        }
    };

    const saveCartToStorage = async (cartData) => {
        try {
            const jsonValue = JSON.stringify(cartData);
            await AsyncStorage.setItem('cart', jsonValue);
        } catch (e) {

        }
    };

    const loadShoesFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('shoes');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error loading data from AsyncStorage:', e);
        }
    };

    const loadCartFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('cart');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Error loading data from AsyncStorage:', e);
        }
    };

    const getCartText = (item) => {
        const filteredcart = cart.filter((itm) => item.id === itm.id)
        if (filteredcart.length === 0) {
            return "Add to cart"
        } else {
            return "Remove from cart"
        }
    }

    const handleLogout = async() => {
        await AsyncStorage.removeItem('userLogin')
        navigation.navigate('Home');
    };
    
    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer} >
                <Text style={styles.header}>Buy Shoes</Text>
                <View style={{flexDirection:'row', gap:10}}>
                    <TouchableOpacity onPress={() => navigation.navigate('CartPage')} style={styles.headerButtonStyles} >
                        <Image source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8AAAB0dHTCwsK7u7t9fX1WVlasrKzV1dXJycmOjo7h4eFpaWn19fU+Pj75+fmDg4Pv7+9BQUEzMzPZ2dlfX1+mpqZvb28TExOwsLDp6elSUlKcnJwWFhYhISFGRkYqKiqSkpI3NzeIiIguLi59M9k0AAAGSUlEQVR4nO2d2XbiMAyGJ6RAIJStpCylBErf/xmng0+bSPHGJJJCj767TidYqi3rt+yYP38URVEURVEURVEURVEURVEURVEURVEURVEURVEURVEURamRLYsRZnCcSJvVGc9viYPps7RtnbBy+fePo7R1XTD3eZiMpM1rT+p1MElepA1szSzg4eP34mfIw+RV2sSWhD1MHnxGdaaKiqu0je04hj1MpG1sx3OEhw+ubl7DHk6lbWxJeJx+SJvYliw42yykTWzNYpMBNkjpPHggWtn9qkC0AcXcWtocAsa/LRAb5L8/EKGHvz8QHz4jWkCBWK0v9tsBP1uCicAZiE9OXUAIyRh6B01UgeitXFFBUhGDgVhWv3gR8DCj8NCZEZcCHlI42KtAnJF46MyIAoE4pvEQBuK8+sWJ3cMDjYfOjMgeiO80DroDMVQm75wlkYfONSJ7IKZUHjrXiNwZkWzt1peMWHpsbEdfMiLhJiZsqArE56eUFDR4SCSbwZkRidlDDwlbcmZEYuBftiBsSapYA5slkmwGmappBj0kkmwGmUCEGyln0rZQIJK2VVGCRoekbYkE4gI2SibZDLAxnkBEwp643C6xfQE1IXXwS2xfwAX2hbg1gUA8wCYJJZuBPxD5JJuBPyPySTYDfyDCBkkl2w32QNzABkklm4FbmkLJtiNvz7N9QQSnZDMwByI6hEYs2W4wByKSbCyLbtgkdSDySjYDb0aE+7LUks3AWqzhlmw3WAORW7IZXBv6FHBLNlurtBkRdiG9ZDMwZkQk2XLCpuowBiK/ZDNADykDkV+yGdgyIqqyPdG1hGDLiBOuhjBsgQglG+fBZK41Itw955FsBqaqqYhkMzBlRBnJdoMpEGUkmwF6SBWIsBXeFztZMqKQZDOwZEQo2U4kbThhCUT4ftmApA03DBlRTLIZGAJRTLIZGDIilGzsr7AwBOIZtMAp2QzQQ4JAFJRsBnJpiiQb/+uA5BlxCz5f4DIO8kCEny9xFwdxIKK/IK9kM6D3EdOnTkkH0EMBB3Eg0sIt2W7kYbu6g1uyGXZhwzpjJeLhNmxYV/CdKAcwvoIgdW8Tn4dS1zaxzaZyL//7767rDL4tpwYxFy51wEbOQ56cyHFIyM2B/gVZ8TtGiF/MG/Xg9rvDkM6/gn9lbycbL4fD5fW6LM675DQfLK9fP9/L10OD9S55f5n9+6Svn4+Tnl3zsxrPvoPyPPiP2SEdfiefXTGW0aFeUnwB2uyuOT7Hd4qWMqsJJ5ntwsxRdEesCsvjJ/FJtIZrPt3HPb53PC6y7LWx+nBYGHlBx8D5+Lkf4XhwGvjFPDwdem8wlBRs33gdjCgVB65oZHj5IMAiVMsI7L4HCwXiOXEUstC/PndNMhXSN0/HLII9Ay3mypDICZmIRdjAJHlzP2/Lgw1Ex+klxkL3xtgm/GwifIFhlIXuUIrqQtFOtNQT14XlrhpHJFqKIJ9F2fxHwUjEffBilhSN6cdx20rj0mkz7U5wgYv+7TEnyJIfHbmYR5mIkv3nz3Ie61yxdT66rqI2Z+I51h5Jbj/Q4BBbZaB0XY82FKHW/U2k9+rRhvKk2JcxXIEZUJ5BMWdd8qMTQeB3UMzxndFHwBIU/EPDcWadDWE/Q10AJyvek6U14MIO9tM0PMygh7CfYP+KaVPoIewnOB1GeAgXyz3xEI5S+LUeMHFbRyl8/xUeH4VHS4nu8gwDMzbYIUKToXW69x0BhoURMWWKXkKudxSqvVhlGxJt9Y7yfDIreHVX9QIWrPbnkYKtghVXRiSOC1lN/DkTgr8CZGt/HIuz78HYuCyUwxc7F2zKfDzJ02OjdOOo8U/w/0suaT4Zr/G/CtZNA3W2YB9EPi65AWVZzFlwHu+N+eIlscM0hixsX+Jbo0c9Lrt/EVOH8KwMYkp1nkIWBxGnMbyDrDGrNJGueoePfnl3V8Jzlfw+4iVgYSCKQpHchy+xu3otDAou/yBwaAVmfL0YsZ/fzPsVZDeT34mzG05RgjJ/dz0vu2VRZ2XfBIwur9h3yUvpWRQwaaqb4o7927yZVz/lJ1FEBspju8udHZBPgV4f9OUwFGTzOnxbz8tiOv6v8XXYD0flvBwtX/vpnqIoiqIoiqIoiqIoiqIoiqIoiqIoiqLQ8BedIknZm4TNegAAAABJRU5ErkJggg==' }}
                            style={{ height: 25, width: 25 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}  style={[styles.headerButtonStyles]}>
                        <Image source={{ uri: 'data:image/png;base64,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' }}
                            style={{ height: 20, width: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>

            {shoes.length === 0 && <View style={{ marginTop: '50%' }}>
                <Text style={{ ...styles.buttonText, color: '#f00' }} >No shoes to show</Text>
            </View>}
            <View style={styles.shoeContainer} >
                {shoes.map((shoe, index) => {
                    const toggleSize = (size) => {
                        shoe.selectedSize = size
                    };
                    return (
                        <View key={index} style={{ elevation: 1, borderWidth: 1, width: '47%', borderColor: 'transparent', }} >
                            <Image
                                source={{ uri: shoe.imageURL }}
                                style={styles.shoeImage}
                            />
                            <Text style={styles.shoeText}>{shoe.brand}</Text>
                            <Text style={styles.shoeText}>Cost: ${shoe.cost}</Text>
                            <Text style={styles.shoeText}>Sizes: {shoe.sizes.join(', ')}</Text>
                            <View style={styles.sizeContainer}>
                                {SIZES?.map((size) => {
                                    return (<TouchableOpacity
                                        disabled={!shoe?.sizes?.includes(size)}
                                        key={size}
                                        style={[
                                            styles.sizeButton,
                                            shoe?.sizes?.includes(size) && styles.selectedSize,
                                            shoe.selectedSize === size && { backgroundColor: 'yellow' }
                                        ]}
                                        onPress={() => toggleSize(size)}
                                    >
                                        <Text style={styles.sizeText}>{size}</Text>
                                    </TouchableOpacity>
                                    )
                                })}
                            </View>
                            <View style={{ gap: 5 }}>
                                <TouchableOpacity onPress={() => handleAddToCart(shoe)} style={styles.buttonStyles}>
                                    <Text style={styles.buttonText}>{getCartText(shoe)}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    sizeButton: {
        borderColor: 'grey',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    selectedSize: {
        // backgroundColor: 'red',
        borderColor: 'red'
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        // alignSelf: 'center',
        textDecorationLine: 'underline'
    },
    buttonStyles: {
        backgroundColor: 'blue',
        alignContent: 'center',
        justifyContent: 'center',
        width: '70%',
        paddingVertical: 10,
        borderRadius: 5,
        alignSelf: 'center', marginBottom: 5
    },
    headerButtonStyles: {
        // backgroundColor: 'blue',
        alignContent: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 5
    },
    sizeText: {
        fontSize: 10,
    },
    buttonText: {
        fontSize: 10,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#fff'
    },
    shoeContainer: {
        marginVertical: 10,
        gap: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: "wrap",
        flex: 1
    },
    shoeImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    shoeText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default UserHomeScreen;