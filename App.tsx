/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LandingPage from './source/onBoardingScreen/LandingPage';
import Login from './source/onBoardingScreen/Login';
import SignUp from './source/onBoardingScreen/SignUp';
import AddShoe from './source/AdminScreens/AddShoe';
import AdminHomeScreen from './source/AdminScreens/AdminHomeScreen';
import UserHomeScreen from './source/UserScreens/UserHomeScreen';
import CartPage from './source/UserScreens/CartPage';

const Stack = createNativeStackNavigator();


function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="AddShoe" component={AddShoe} options={{ headerShown: false }} />
        <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CartPage" component={CartPage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
