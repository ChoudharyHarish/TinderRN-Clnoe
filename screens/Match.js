import { View, Text , Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function Match() {

    const navigation = useNavigation();
    const {params} = useRoute();

    const {userProfile,swippedUser} = params;

  return (
    <View className = 'bg-red-500 opacity-90 px-8 flex-1 justify-center'>
            <Image className='h-60 w-full' resizeMode='contain'  source={require("../assets/banner.png")} />
            <View className='h-1/2 justify-between mt-4'>

             <View className='h-1/4 w-full justify-between'>
             <Text className='text-white' style={{fontSize:16}} >You and {swippedUser?.displayName} have liked each other</Text>
            <View className='flex-row justify-between mt-4' >
            <Image resizeMode='cover'  source={{uri:swippedUser?.photoURL}} className='h-36 w-36 rounded-full'/>
            <Image resizeMode='cover' source={{uri:userProfile?.photoURL}} className='h-36 w-36 rounded-full'/>
            </View>
            </View>

            <TouchableOpacity 
            onPress={() => {navigation.goBack(); navigation.navigate("Chat")}}
            className='bg-white p-6 w-full ' style={{borderRadius:50}} >
                <Text className='text-lg text-center text-gray-700'  >Send a Message</Text>
            </TouchableOpacity>
            </View>

            
    </View>
  )
}