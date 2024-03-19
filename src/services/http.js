import axios from "axios";
import store from "../store/store";
import { toast } from "react-toastify";
let apiUrl;
if (document.URL.indexOf("mitiztechnologies") >= 0 || document.URL.indexOf("localhost") >= 0) {
  // apiUrl = "http://imagdent.mitiztechnologies.in/api";
  apiUrl = "http://localhost/imag-dent";
  if (document.URL.indexOf("https") === 0) {
    apiUrl = "https://imagdent.mitiztechnologies.in/api";
  }
}
else {
  apiUrl = "http://imagdent.com/api";
  if (document.URL.indexOf("https") === 0) {
    apiUrl = "https://imagdent.com/api";
  }
}
const http = axios.create({
  baseURL: apiUrl,
  //timeout: 1000,
  headers: { "Content-Type": "application/json" }
});
http.interceptors.request.use(
  config => {
    if (store.getState().token) {
      config.headers.common["X-Api-Key"] = `Bearer  ${store.getState().token}`;
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      //window.location.href = "/logout";
    } else if (error.response.status === 404) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if (error.response.status === 500) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if (error.response.status === 403) {
      toast.error('You donot have permission to perform this action. Contact to ImagDent Admin.', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else {
      console.log(error);
    }
    return Promise.reject(error);
  }
);

export default http;
