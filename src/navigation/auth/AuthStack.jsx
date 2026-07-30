import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../../screens/auth/Login';

const AuthStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen component={Login} name="Login" options={{ title: '' }} />
            </Stack.Group>
        </Stack.Navigator>
    )
}

export default AuthStack