const MY_IP = "172.20.208.1";

export const BASE_URL = `http://${MY_IP}:5000/terra-track/api`;
export const REGISTER = BASE_URL + "/auth/register";
export const LOGIN = BASE_URL + "/auth/login";
export const GET_USER = BASE_URL + "/auth/get-user";
export const UPDATE_USER = BASE_URL + "/auth/update-user";
export const POST_SHARE = BASE_URL + "/posts/create";
export const POST_HOMEPAGE = BASE_URL + "/posts";
export const PROFİLE = BASE_URL + "/posts";

export const getUserProfileUrl = async () => {
  const userId = await AsyncStorage.getItem("userId");
  return `${BASE_URL}/auth/get-user`;
};
