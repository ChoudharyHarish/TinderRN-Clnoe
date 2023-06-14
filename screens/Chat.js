import { View, Text,FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'

import Header from '../components/Header';
import ChatRow from '../components/ChatRow';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import useAuth from '../Context/useAuth';

export default function Chat() {

  const [matches,setMatches] = useState([]);
  const {user}  = useAuth();

  useEffect(() => {
     const unsub = onSnapshot(query(
        collection(db,'matchedUsers'),
        where('usersMatched','array-contains',user.uid)
        ), 
        snapshot => setMatches(snapshot.docs.map((doc) => ({
              id:doc.id,
              ...doc.data(),
        })))    
        ) 

      
      return unsub;
  },[])


  return (
    <View  style={{
      paddingTop: Platform.OS === "android" ? 45 : 0,
    }}>
        <Header title='Chats' />
        {matches.length > 0 ? (
            <FlatList  
              data = {matches}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                  <ChatRow matchDetails = {item}/>
              )}

            />
          )
        :(    
            <View className = 'p-5'>
              <Text className='text-center text-lg text-red-400' >No Matches at the moment</Text>
            </View>
        )}
    </View>
  )
}