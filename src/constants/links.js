import AsyncStorage from "@react-native-async-storage/async-storage";

const MY_IP = "192.168.1.34";

export const BASE_URL = `http://${MY_IP}:5000/terra-track/api`;
export const REGISTER = BASE_URL + "/auth/register";
export const LOGIN = BASE_URL + "/auth/login";
export const GET_USER = BASE_URL + "/auth/get-user";
export const UPDATE_USER = BASE_URL + "/auth/update-user";
export const POST_SHARE = BASE_URL + "/posts/create";
export const POST_HOMEPAGE = BASE_URL + "/posts";
export const PROFILE = BASE_URL + "/posts";
export const POST_MY = BASE_URL + "/posts";
export const SAVE_ROUTE = BASE_URL + "/routes/create";

export const getUserProfileUrl = async () => {
  const userId = await AsyncStorage.getItem("userId");
  if (!userId) {
    throw new Error("User ID not found");
  }
  return `${BASE_URL}/auth/get-user`;
};
