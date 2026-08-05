import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Programs from '../../screens/user/Programs/Programs';
import EditProgram from '../../screens/user/Programs/EditProgram';
import CreateProgram  from '../../screens/user/Programs/CreateProgram';
import ProgramBuilder from '../../screens/user/Programs/ProgramBuilder';
import ShareProgram from '../../screens/user/Programs/ShareProgram';

const Stack = createNativeStackNavigator();

const ProgramsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="programsList" component={Programs} />
      <Stack.Screen name="editProgram" component={EditProgram} />
      <Stack.Screen name="createProgram" component={CreateProgram} />
      <Stack.Screen name="programBuilder" component={ProgramBuilder} />
      <Stack.Screen name="shareProgram" component={ShareProgram} />
    </Stack.Navigator>
  );
};

export default ProgramsStack;