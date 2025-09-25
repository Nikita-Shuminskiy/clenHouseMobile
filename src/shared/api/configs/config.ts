import axios from "axios";
import { stringify } from "qs";

import { getRefreshToken, getToken, removeRefreshToken, removeToken, setRefreshToken, setToken } from "../../utils/token";
import { QS_OPTIONS } from "../constants/qs-options";

export const API_URL = "https://dockmapapi-production.up.railway.app/";
//https://dockmapapi-production.up.railway.app/
//http://192.168.0.11:3000/
//http://192.168.0.50:3000/api
export const instance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
  },
  paramsSerializer: (params) => stringify(params, QS_OPTIONS),
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      //@ts-ignore
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          await removeToken();
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}auth/refresh`, {
          refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        await setToken(access_token);
        await setRefreshToken(refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return instance(originalRequest);
      } catch (e) {
        await removeToken();
        await removeRefreshToken();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
