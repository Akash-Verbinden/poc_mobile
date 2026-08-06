import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateTemplate from '../../screens/user/Communication/CreateTemplate';
import BulkEmail from '../../screens/user/Communication/BulkEmail';
import Communication from '../../screens/user/Communication/Communication';
import EditTemplate from '../../screens/user/Communication/EditTemplate';


const Stack = createNativeStackNavigator();

const CommunicationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="communicationList" component={Communication} />
      <Stack.Screen name="createTemplate" component={CreateTemplate} />
      <Stack.Screen name="editTemplate" component={EditTemplate} />
      <Stack.Screen name="bulkEmail" component={BulkEmail} />
    </Stack.Navigator>
  );
};

export default CommunicationStack;