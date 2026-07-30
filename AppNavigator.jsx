import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import AuthStack from './src/navigation/auth/AuthStack';
import { RootSiblingParent } from 'react-native-root-siblings';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useSelector((state) => state.auth);

  const isAuthenticated = Boolean(token);

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthStack} />
          ) : (
            <Stack.Screen name="Main" component={DrawerNavigator} />
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}