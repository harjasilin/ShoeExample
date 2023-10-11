import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { SIZES } from '../contansts';

const AddShoe = ({ navigation, route }) => {
    const { shoedata } = route.params
    const [shoes, setShoes] = useState([]);
    const [brand, setBrand] = useState('');
    const [cost, setCost] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    
    const toggleSize = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter((s) => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    const loadShoesFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('shoes');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {

        }
    };

    const handleAddShoe = () => {
        if (!brand || !cost || !imageURL || selectedSizes.length === 0) {
            alert('Please fill in all fields.');
            return;
        }

        const newShoe = {
            id: shoes.length > 0 ? shoes[shoes.length - 1].id + 1 : 1,
            brand,
            cost,
            imageURL,
            sizes: selectedSizes,
        };
        if (shoedata) {
            let filteredShoes = shoes.filter((itm) => itm.id != shoedata.id)
            setBrand('');
            setCost('');
            setImageURL('');
            setSelectedSizes([]);
            setShoes([...filteredShoes, newShoe]);
            saveShoesToStorage([...filteredShoes, newShoe]);
        } else {
            setShoes((prev) => [...prev, newShoe]);
            setBrand('');
            setCost('');
            setImageURL('');
            setSelectedSizes([]);
            saveShoesToStorage([...shoes, newShoe]);
        }
        navigation.push('AdminHomeScreen')
    };
    useEffect(() => {
        const loadShoes = async () => {
            const storedShoes = await loadShoesFromStorage();
            if (storedShoes) {
                setShoes(storedShoes);
            }
            shoedata && handleEditShoe()
        };
        navigation.addListener('focus', () => {
            loadShoes();
        });
        loadShoes()
    }, []);
    const handleEditShoe = () => {
        setBrand(shoedata.brand);
        setCost(shoedata.cost);
        setImageURL(shoedata.imageURL);
        setSelectedSizes(shoedata.sizes);
    };

    const saveShoesToStorage = async (newValue) => {
        try {
            const jsonValue = JSON.stringify(newValue);
            await AsyncStorage.setItem('shoes', jsonValue);
        } catch (e) {

        }
    };

    const onpickerClick =async()=>{
        const options ={

        }
        const result = await launchImageLibrary(options);
        setImageURL(result.assets[0]?.uri)
        console.log('image',result.assets[0]?.uri )
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Add Shoe Information</Text>

            <Text>Brand:</Text>
            <TextInput
                style={styles.input}
                placeholder="Brand"
                value={brand}
                onChangeText={(text) => setBrand(text)}
            />

            <Text>Cost:</Text>
            <TextInput
                style={styles.input}
                placeholder="Cost"
                value={cost}
                keyboardType={'numeric'}
                onChangeText={(text) => setCost(text)}
            />

            <Text>Image:</Text>
            {imageURL &&  <Image source={{uri:imageURL}} style={{height:100, width:100, marginVertical:10}} />}
            <Button  title={imageURL ?'Update Image':'Select Image'} onPress={onpickerClick} />

            <Text>Select Sizes:</Text>
            <View style={styles.sizeContainer}>
                {SIZES.map((size) => (
                    <TouchableOpacity
                        key={size}
                        style={[
                            styles.sizeButton,
                            selectedSizes.includes(size) && styles.selectedSize,
                        ]}
                        onPress={() => toggleSize(size)}
                    >
                        <Text style={styles.sizeText}>{size}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={{ backgroundColor: 'red', height: 50, width: 120, borderRadius: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 20 }} onPress={handleAddShoe}>
                <Text style={{ fontSize: 18, color: 'white' }}>{shoedata ? "Save Shoe" : "Add Shoe"}</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,marginTop:30
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        padding: 8,
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sizeButton: {
        borderColor: 'red',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    selectedSize: {
        backgroundColor: 'red',
    },
    sizeText: {
        fontSize: 16,
    },
    shoeContainer: {

    },
    shoeImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 10,
    },
    shoeText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default AddShoe;