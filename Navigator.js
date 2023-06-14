import { View, Text } from "react-native";
import React, { useEffect } from "react";
import useAuth from "./Context/useAuth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Auth, Home, Chat } from "./screens";
import AccountModal from "./screens/AccountModal";
import Match from "./screens/Match";
import ChatUser from "./screens/ChatScreen";


const Stack = createNativeStackNavigator();

export default function Navigator() {
  const { user } = useAuth();
  // console.log(user);

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => null,
      }}
    >
      {!user ? (
        <Stack.Screen name="Auth" component={Auth} />
      ) : (
        <>
          <Stack.Group>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="ChatScreen" component={ChatUser} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation:'modal',animation:'slide_from_bottom'}} >
            <Stack.Screen name = 'AccountModal' 
              component={AccountModal}/>
          </Stack.Group>
          <Stack.Group screenOptions={{presentation:'transparentModal',animation:'slide_from_right'}} >
            <Stack.Screen name = 'Match' 
              component={Match}/>
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}
