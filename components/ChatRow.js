import { View, Text, Image, TouchableOpacity,StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import getMatchedUserInfo from "../utils/getMatchedUserInfo";
import useAuth from '../Context/useAuth';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseconfig';


export default function ChatRow({matchDetails}) {

  const {user} = useAuth();
  const [info,setInfo] = useState([]);
  const [lastMessage,setLastMessage] = useState('');

  const navigation = useNavigation();
  useEffect(() => {
      setInfo(getMatchedUserInfo(matchDetails.users,user.uid));
  },[user,matchDetails])

  useEffect(() =>{
      const unsub = onSnapshot(query(
        collection(db,'matchedUsers',matchDetails.id,'messages'),
        orderBy('timeStamp','desc')
        ),
        snapshot => { setLastMessage(snapshot.docs[0]?.data()?.message);} 
      )
      return unsub;
  },[db,matchDetails])
  return (
    <TouchableOpacity 
    onPress={() => navigation.navigate('ChatScreen',{matchDetails})}
    className = "flex-row px-4 py-4 m-2 items-center bg-white rounded-lg"
    style= {styles.cardShadow} >
       <Image source={{uri:info?.user?.photoURL}} className='h-16 w-16 rounded-full' resizeMode='cover'/>
      <View className='ml-4'>
      <Text className='font-bold text-lg'>{info?.user?.displayName}</Text>
      <Text className='text-md'>{lastMessage ||  "Say HI!"}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles  =StyleSheet.create({
      cardShadow:{
        shadowColor:'#000',
        shadowOffset:{
          width:0,
          height:1
        },
        shadowOpacity:0.2,
        shadowRadius:1.4,
        elevation:2
      },
    
})