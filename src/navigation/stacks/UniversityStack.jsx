import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Universities from '../../screens/user/University/Universities';
import CreateUniversity from '../../screens/user/University/CreateUniversity';

const Stack = createNativeStackNavigator();

const UniversityStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="university" component={Universities} />
      <Stack.Screen name="createUniversity" component={CreateUniversity} />
    </Stack.Navigator>
  );
};

export default UniversityStack;
