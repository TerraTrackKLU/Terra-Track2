import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Map from "../screens/Map";
import Cark from "../screens/Cark";
import Profile from "../screens/Profile";
import HomePage from "../screens/HomePage";
import { Ionicons } from "@expo/vector-icons";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import WheelPage from "../screens/WheelPage";
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: "green",
  },
};
const Tab = createMaterialBottomTabNavigator();

const BottomNavigationTab = () => {
  return (
    <PaperProvider theme={theme}>
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="white"
        inactiveColor="black"
        barStyle={{ backgroundColor: "green" }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === "HomePage") {
              iconName = "home";
            } else if (route.name === "Map") {
              iconName = "map";
            } else if (route.name === "Spin") {
              iconName = "car";
            } else if (route.name === "Profile") {
              iconName = "person";
            }
            return <Ionicons name={iconName} size={20} color={color} />;
          },
        })}
      >
        <Tab.Screen name="HomePage" component={HomePage} />
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen name="Spin" component={Cark} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </PaperProvider>
  );
};

export default BottomNavigationTab;
