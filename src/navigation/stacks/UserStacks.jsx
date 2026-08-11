// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import React from 'react';
// import Dashboard from '../../screens/user/Dashboard/Dashboard';
// import Programs from '../../screens/user/Programs/Programs';
// import Communication from '../../screens/user/Communication/Communication';
// import Universities from '../../screens/user/University/Universities';
// import Offers from '../../screens/user/Offers';
// import Students from '../../screens/user/Students';
// import Resources from '../../screens/user/Resources';
// import LogOut from '../../screens/user/Logout';

// const Stack = createNativeStackNavigator();

// const UserStacks = () => {
//   const Stack = createNativeStackNavigator();
//   return (
//     <Stack.Navigator
//       initialRouteName="dashboard"
//       screenOptions={{ headerShown: false }}
//     >
//       <Stack.Group>
//         <Stack.Screen name="dashboard" component={Dashboard} />
//         <Stack.Screen name="programs" component={Programs} />
//         <Stack.Screen name="communication" component={Communication} />
//         <Stack.Screen name="universities" component={Universities} />
//         <Stack.Screen name="offers" component={Offers} />
//         <Stack.Screen name="students" component={Students} />
//         <Stack.Screen name="resources" component={Resources} />
//         <Stack.Screen name="logout" component={LogOut} />
//       </Stack.Group>
//     </Stack.Navigator>
//   );
// };

// export default UserStacks;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../../screens/user/Dashboard/Dashboard';
import Programs from '../../screens/user/Programs/Programs';
import Communication from '../../screens/user/Communication/Communication';
import Offers from '../../screens/user/Offers';
import Students from '../../screens/user/Students';
import Resources from '../../screens/user/Resources';
import LogOut from '../../screens/user/Logout';
import UniversityStack from '../../navigation/stacks/UniversityStack';

const Stack = createNativeStackNavigator();

const UserStacks = () => {
  return (
    <Stack.Navigator
      initialRouteName="dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Group>
        <Stack.Screen name="dashboard" component={Dashboard} />
        <Stack.Screen name="programs" component={Programs} />
        <Stack.Screen name="communication" component={Communication} />
        {/* Render UniversityStack under the universities route */}
        <Stack.Screen name="universities" component={UniversityStack} />
        <Stack.Screen name="offers" component={Offers} />
        <Stack.Screen name="students" component={Students} />
        <Stack.Screen name="resources" component={Resources} />
        <Stack.Screen name="logout" component={LogOut} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default UserStacks;