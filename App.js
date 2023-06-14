import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./Context/useAuth";
import Navigator from "./Navigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
