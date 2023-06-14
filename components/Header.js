import { View, Text, TouchableOpacity} from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Header({ title, callEnabled, padding }) {
  const navigation = useNavigation();
  return (
    <View
      className="flex-row gap-4 items-center pl-4">
      <FontAwesome
        name='arrow-left'
        color="rgb(239 68 68)"
        size={22}
        onPress={() => navigation.goBack()}
      />
      <Text  className='font-bold text-2xl flex-1'  >{title}</Text>

      {callEnabled && (
        <TouchableOpacity className="p-2 rounded-xl bg-red-100 mr-4">
          <FontAwesome name="phone" color="rgb(239 68 68)" size={22} />
        </TouchableOpacity>
      )}
    </View>
  );
}
