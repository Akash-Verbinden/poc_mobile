import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Programs from '../../screens/user/Programs/Programs';
import EditProgram from '../../screens/user/Programs/EditProgram';
// import AddProgram from '../../screens/user/Programs/AddProgram';
// import ProgramDetails from '../../screens/user/Programs/ProgramDetails';
import ShareProgram from '../../screens/user/Programs/ShareProgram';

const Stack = createNativeStackNavigator();

const ProgramsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="programsList" component={Programs} />
      <Stack.Screen name="editProgram" component={EditProgram} />
      {/* <Stack.Screen name="AddProgram" component={AddProgram} />
      <Stack.Screen name="ProgramDetails" component={ProgramDetails} /> */}
      <Stack.Screen name="shareProgram" component={ShareProgram} />
    </Stack.Navigator>
  );
};

export default ProgramsStack;