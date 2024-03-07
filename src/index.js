import "react-app-polyfill/ie9"; // For IE 9-11 support
import "react-app-polyfill/ie11"; // For IE 11 support
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store/store";
import common from "./services/common";


let inactivityTime = function() {
  let versioncode = "3"
  let time;
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeypress = resetTimer;
  function logout() {
    common.getBuild().then((res)=>{
      if(res.data.build.version_code != versioncode)
      window.location.reload(true);
    })
    .catch(function (error) {
      console.log(error);
    });
   }
  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 180000)

  }
};
window.onload = function() {
  inactivityTime();
}



ReactDOM.render(
  
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
