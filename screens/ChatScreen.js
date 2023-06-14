import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList
} from "react-native";
import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import useAuth from "../Context/useAuth";
import { addDoc, collection, onSnapshot, orderBy, serverTimestamp, query } from "firebase/firestore";
import { db } from "../firebaseconfig";
import getMatchedUserInfo from "../utils/getMatchedUserInfo";


const Message = ({ userId, message ,img}) => {
  const {user} = useAuth();

  const reciever = Boolean(userId !== user.uid);

  return (
    <View
      className={`flex-row  mt-4 mx-4 rounded-lg`}
    >
      {reciever && <Image source={{uri:img}} className="h-10 w-10 rounded-full mr-2" />}
     <Text className={`text-white text-right text-lg ${reciever ? "bg-red-400 mr-auto" : "bg-purple-600 ml-auto"} px-4 py-2 rounded-lg`}>{message}</Text>
    </View>
  );
};

export default function ChatUser() {
  const { params } = useRoute();
  const { matchDetails } = params;
  const {user} = useAuth();
  const [info,setInfo]=useState([]);
  const [message, setMessage] = useState("");
  const [messages,setMessages] = useState([]);

useEffect(() => {
  setInfo(getMatchedUserInfo(matchDetails.users,user.uid));
},[user,matchDetails])


      useEffect(() => {
          onSnapshot(query(
            collection(db,'matchedUsers',matchDetails.id,'messages'),
            orderBy("timeStamp",'desc')
          ),snapshot => setMessages(snapshot.docs.map((doc) => ({
                      id:doc.id,
                      ...doc.data()
          }))))
      },[])



    const sendMessage = () => {
       addDoc(collection(db,'matchedUsers',matchDetails.id,'messages'),{
          timeStamp:serverTimestamp(),
          userId:user.uid,
          displayName:user.displayName,
          photoURL:matchDetails.users[user.uid].photoURL,
          message:message
        })
        setMessage('');
    }


  return (
    <View
      style={{
        paddingTop: Platform.OS === "android" ? 45 : 0,
        height: "100%",
      }}
    >
      <Header title={info?.user?.displayName} callEnabled="true" padding="2" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 "
        keyboardVerticalOffset={10}
      >

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
              <FlatList
                  data={messages}
                  inverted={-1}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => <Message {...item} img = {info?.user?.photoURL}/>}
              />
        </TouchableWithoutFeedback>
       </KeyboardAvoidingView>

       
          <View
            className="my-4 flex-row  mx-4 rounded-xl items-center justify-between bg-white"

          >
            <TextInput
              className="py-3 px-2 text-gray-400 w-3/4 rounded-xl text-lg bg-white"
              placeholder="Send a Message..."
              value={message}
              onChangeText={(value) => setMessage(value)}
            />
            <TouchableOpacity
                disabled = {!message}
              onPress={() => sendMessage()}
              className="p-4 rounded-xl"
              style={{ borderColor: "rgb(239,68,68)", borderWidth: 1 }}
            >
              <Text className="text-red-500 font-bold">Send</Text>
            </TouchableOpacity>
          </View>
    </View>
  );
}
