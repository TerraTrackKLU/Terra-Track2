const MY_IP = "172.20.10.2";

export const BASE_URL = `http://${MY_IP}:5000/terra-track/api`;
export const REGISTER = BASE_URL + "/auth/register";
export const LOGIN = BASE_URL + "/auth/login";
export const GET_USER = BASE_URL + "/auth/get-user";
export const POST_SHARE = BASE_URL + "/posts/create";
export const POST_HOMEPAGE = BASE_URL + "/posts";

export const POST_DETAIL = `http://${MY_IP}:5000/terra-track/api/posts`; // Doğru URL'yi kullandığınızdan emin olun
export const POST_UPDATE = `http://${MY_IP}:5000/terra-track/api/posts`; // Güncelleme için de URL'yi kontrol edin
