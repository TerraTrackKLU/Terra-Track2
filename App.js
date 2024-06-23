import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomNavigationTab from "./src/navigations/BottomNavigationTab";
import Login from "./src/screens/Login";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ForgotPassword from "./src/screens/ForgotPassword";
import Register from "./src/screens/Register";
import PostDetail from "./src/screens/PostDetail";
import MyFav from "./src/screens/MyFavorites";
import MyRoutes from "./src/screens/MyRoutes";
import EdProf from "./src/screens/EditProfile";
import 'react-native-gesture-handler';
import FollowRoute from "./src/screens/FollowRoute";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import SplashScreen from "./src/screens/SplashScreen";


const Stack = createNativeStackNavigator();

function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={BottomNavigationTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Forgot Password"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Follow Route"
          component={FollowRoute}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PostDetail" component={PostDetail} />
        <Stack.Screen name="MyFavorites" component={MyFav} />
        <Stack.Screen name="MyRoutes" component={MyRoutes} />
        <Stack.Screen name="EditProfile" component={EdProf} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const AppProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppProvider;
