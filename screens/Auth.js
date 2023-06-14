import {View,Text,Button, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import useAuth from "../Context/useAuth";

const  Authentication = () => {
    const {user,signInWithGoogle} = useAuth();
    return (   
      <View style={styles.container}>
            <ImageBackground
              source={require('../assets/bg.jpeg')}
              style={styles.image}
            >

          <TouchableOpacity
              onPress={() => signInWithGoogle()}
              style= {styles.button}
            >
              <Text style={styles.text}>Sign and Get Swapping</Text>

          </TouchableOpacity>

          <Text>{user?.displayName}</Text>
          </ImageBackground>
      </View>
        
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    alignItems:"center"
  },
  button:{
    backgroundColor:"#fff",
    padding:18,
    borderRadius:20,
    marginBottom:40
  },
  text : {
    color:'#FD297B',
    fontSize:16,
    fontWeight:'bold'
  }
})

export default Authentication;