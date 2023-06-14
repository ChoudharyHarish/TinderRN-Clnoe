import { createContext, useContext, useState, useEffect, useMemo } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseconfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "firebase/auth";

const UserContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialloading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "496721236009-3da0p8bf7lp1s28ei56rg9auc4qkrc39.apps.googleusercontent.com",
    expoClientId:
      "496721236009-4m960jluid8uogt11arkn3j73ldjkpaf.apps.googleusercontent.com",
      responseType: "id_token",
    });
    
    
    const signInWithGoogle = async () => {
      await promptAsync();
    };
    
    useEffect(() => {      
      onAuthStateChanged(auth, async(user) => {
        if (user) {
          const usr = {
            photoURL:user.photoURL,
            displayName : user.displayName,
            uid: user.uid
          }
          await AsyncStorage.setItem('user',JSON.stringify(usr));
          setUser(user);
        } else {
          console.log("user not logged in");
        }
        setInitialLoading(false);
      });
  
      const  getData = async() => {
        try{
          let usr  =  await AsyncStorage.getItem('user');
          if(usr){
              usr = JSON.parse(usr);
              setUser(usr);
          }
        }
        catch(error) {console.log(error)}
      }
          getData();
       
      // return unsubscribe;
    }, []);
  useEffect(() => {
    const signInWithFirebase = async(token) => {
      const credential = GoogleAuthProvider.credential(token);
      try{
        await signInWithCredential(auth, credential);
      }
      catch(error) {
        console.log(error);
      }
    }
    if (response?.type === "success") {
      signInWithFirebase(response.params.id_token);
    }
    if(response?.type === 'error'){
      console.log(response.error);
    }
  }, [response]);



  const logout = () => {
    signOut(auth);
    AsyncStorage.removeItem('user');
    setUser(null);
  };

  const cache = useMemo(
    () => ({ user, signInWithGoogle, initialloading, logout }),
    [user, signInWithGoogle, initialloading]
  );

  return (
    <UserContext.Provider value={cache}>
      {!initialloading && children}
    </UserContext.Provider>
  );
};

export default function useAuth() {
  return useContext(UserContext);
}
