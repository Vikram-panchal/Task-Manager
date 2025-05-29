import axios from "axios";
import { BASEURL } from "./apiPaths";

const apiService = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//request interceptor
apiService.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //Handle common error globaly
    if(error.response){
        if(error.response.status === 401){
            // localStorage.removeItem("token");
            window.location.href = "/login";
        } else if(error.response.status ===500){
            console.error("Server Error. Please try again later.");
        }
    } else if(error.code === "ECONNREFUSED"){
        console.error("Request timeout. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default apiService;