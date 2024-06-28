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
import "react-native-gesture-handler";
import FollowRoute from "./src/screens/FollowRoute";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import SplashScreen from "./src/screens/SplashScreen";
import PostShare from "./src/screens/PostShare";
import MyPosts from "./src/screens/MyPosts";
import SaveRoute from "./src/screens/SaveRoute";
import UserProfile from "./src/screens/UserProfile"; // Make sure the path is correct
import RouteDetail from "./src/screens/RouteDetail";
import PostUpdate from "./src/screens/PostUpdate";

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
          name="SaveRoute"
          component={SaveRoute}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FollowRoute"
          component={FollowRoute}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PostShare" component={PostShare} />
        <Stack.Screen name="PostDetail" component={PostDetail} />
        <Stack.Screen name="RouteDetail" component={RouteDetail} />
        <Stack.Screen name="MyFavorites" component={MyFav} />
        <Stack.Screen name="MyRoutes" component={MyRoutes} />
        <Stack.Screen name="EditProfile" component={EdProf} />
        <Stack.Screen name="MyPosts" component={MyPosts} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="PostUpdate" component={PostUpdate} />
        {/* Make sure this is correctly placed */}
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