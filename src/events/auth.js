import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { clearUser, setUser } from "../redux/slices/userSlice";
import axios from "axios";
import { GET_USER } from "../constants/links";

// Token'ı kaydetmek için fonksiyon
export const saveToken = async (token) => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 10); // 10 gün geçerli olacak
    const tokenData = {
      token,
      expirationDate: expirationDate.toISOString(),
    };
    await AsyncStorage.setItem("userToken", JSON.stringify(tokenData));
  } catch (error) {
    console.log("Error saving token:", error);
  }
};

// Token'ı yüklemek ve Redux'a kaydetmek için fonksiyon
export const loadToken = () => async (dispatch) => {
  try {
    const tokenData = await AsyncStorage.getItem("userToken");

    if (tokenData) {
      const { token, expirationDate } = JSON.parse(tokenData);
      if (new Date() < new Date(expirationDate)) {
        const decoded = jwtDecode(token); // Token'dan kullanıcı bilgilerini çözümleme
        console.log('dataa', decoded)

        try {
          const response = await axios.get(GET_USER, {
            headers: {
              userid: decoded.userId,
            },
          });
          const user = response.data;
          dispatch(setUser({ user }));
          return true; // Kullanıcı bilgileri başarıyla yüklendi
        } catch (error) {
          console.log("Error fetching user data:", error);
          await AsyncStorage.removeItem("userToken");
          dispatch(clearUser());
          return false; // Kullanıcı bilgileri çekilemedi
        }
      } else {
        await AsyncStorage.removeItem("userToken");
        dispatch(clearUser());
        return false; // Token süresi dolmuş
      }
    }
    return false; // Token yok
  } catch (error) {
    console.log("Error loading token:", error);
    return false; // Token yükleme hatası
  }
};

// Kullanıcıyı çıkış yapmak için fonksiyon
export const logout = (navigation) => async (dispatch) => {
  try {
    await AsyncStorage.removeItem("userToken");
    dispatch(clearUser());
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (error) {
    console.log("Error logging out:", error);
  }
};
