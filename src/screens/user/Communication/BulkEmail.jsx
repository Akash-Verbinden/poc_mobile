import React from 'react'
import { View,Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';


const BulkEmail = () => {
    const navigation = useNavigation();
  return (
    <View>
      <Text>BulkEmail</Text>
      <Text onPress={() => navigation.navigate('communicationList')}>
              Go Back to Communication List
            </Text>
    </View>
  )
}

export default BulkEmail