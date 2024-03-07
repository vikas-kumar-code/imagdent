//export const SERVER = "http://localhost/civ-works";
import axios from "axios";
export const SERVER = "http://civ-works.mitiztechnologies.in/api";
axios.defaults.baseURL = "http://civ-works.mitiztechnologies.in/api";
export const setToken = () => {
  if (sessionStorage.getItem("token")) {
    axios.defaults.headers.common["X-Api-Key"] =
      "Bearer " + sessionStorage.getItem("token");
    console.log(sessionStorage.getItem("token"));
  }
};

/* profileObj:
email: "opnsrc.devlpr@gmail.com"
familyName: "Source"
givenName: "Open"
googleId: "107422500246867143956"
imageUrl: "https://lh3.googleusercontent.com/-bv5nmwwygGA/AAAAAAAAAAI/AAAAAAAAARs/989PW7NSKdg/s96-c/photo.jpg"
name: "Open Source" */
