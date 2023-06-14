import { View, Text, Button, Pressable , TouchableOpacity,TextInput, Alert, Image, KeyboardAvoidingView} from 'react-native'
import React,{useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../Context/useAuth';
import { Platform } from 'react-native';

import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseconfig';

// url : https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250

export default function AccountModal() {

    const navigation = useNavigation();
    const {user} = useAuth();
    const [form,setForm] = useState({
        job:"",
        profilePic:"",
        age:"",
    })

    const valid = Boolean(form.job && form.age);


    const updateUserProfile = async() => {
        try{
        await setDoc(doc(db, "users",user.uid), {
                id:user.uid,
                displayName:user.displayName,
                photoURL:form.profilePic ? form.profilePic : user.photoURL,
                job : form.job,
                age : form.age,
                timeStamp:serverTimestamp()

          });
        }
        catch(err){
            console.log(err);
        }
    }

    const handlePress = () => {
        if(valid){
            updateUserProfile();
            navigation.navigate('Home');
        }
        else {
            Alert.alert("Please Fill in all the details")
        }
    }


  return (
    <View className = 'flex-1 items-center rounded-lg' 
        style={{
        paddingTop: Platform.OS === "android" ? 40 : 0,
    }}>
      <Text className='font-bold text-2xl bg-red-400 w-full text-center text-white p-2 rounded-t-lg' >Upate my profile</Text>

{/* 
    <Image 
    resizeMode='stretch'
    className='rounded-t-lg h-20 w-full'
    source = {require("../assets/banner.png")}/> */}

        <View className='items-center w-full h-4/5 mt-12' >
        <Text className='font-bold text-xl text-gray-600 p-2'
        >Welcome {user.displayName}!</Text>

        <Text className='font-bold text-lg p-4 text-red-400' >Step 1: The Profile Pic</Text>
        <TextInput
            value = {form.profilePic}
            cursorColor='rgb(248 113 113)'
            placeholder='Enter a Profile Pic URL'
            className = 'p-3 text-lg mt-2 w-3/4 bg-white text-center rounded-xl'
            onChangeText={(value) => setForm({...form,profilePic:value})}
        />

        <Text className='font-bold text-lg p-4 text-red-400' >Step 2: The Job</Text>
        <TextInput
            value = {form.job}
            placeholder='Enter your occupation'
            cursorColor='rgb(248 113 113)'
            className = 'p-3 text-lg mt-2 w-3/4 bg-white text-center rounded-xl'
            onChangeText={(value) => setForm({...form,job:value})}
        />

        <Text className='font-bold text-lg p-4 text-red-400' >Step 3: The Age</Text>
        <TextInput
            value = {form.age}
            placeholder='Enter your age'
            maxLength={2}
            keyboardType='numeric'
            cursorColor='rgb(248 113 113)'
            className = 'p-3 text-lg  mt-2 w-3/4 bg-white text-center rounded-xl'
            onChangeText={(value) => setForm({...form,age:value})}
        />
        </View>

      <TouchableOpacity 
        onPress={() => handlePress()}
        className = 'p-3 bg-red-400 rounded-2xl  w-1/2' >
            <Text className='text-white text-lg text-center' >Update Profile</Text>
      </TouchableOpacity>
    </View>
  )
}