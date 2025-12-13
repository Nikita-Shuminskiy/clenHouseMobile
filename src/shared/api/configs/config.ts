import axios from "axios";
import { stringify } from "qs";

import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  setRefreshToken,
  setToken,
} from "../../utils/token";
import { QS_OPTIONS } from "../constants/qs-options";

export const API_URL = "https://cleanhouse123-cleanhouseapi-209c.twc1.net/";
//https://cleanhouse123-cleanhouseapi-209c.twc1.net/
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
        const accessToken = await getToken();

        if (!refreshToken || !accessToken) {
          await removeToken();
          await removeRefreshToken();
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}auth/refresh`, {
          accessToken,
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;
        await setToken(newAccessToken);
        await setRefreshToken(newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
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
