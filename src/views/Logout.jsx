import React from "react";
import { Redirect } from "react-router-dom";
import store from "../store/store";
import { doLogout } from "../store/actions";
import user from "../services/user";
import { Spinner } from "reactstrap";

class Logout extends React.Component {
  state = {};
  componentDidMount() {
    user
      .logOut()
      .then((res) => {
        localStorage.clear();
        store.dispatch(doLogout({}));
        window.location.href = "/";
      })
      .catch((result) => {
        localStorage.clear();
        store.dispatch(doLogout({}));
        window.location.href = "/";
      });
  }
  render() {
    return (
      <div className="p-5 text-center mt-5">
        <Spinner />
        <br />
        <h2>Logging out..</h2>
      </div>
    );
  }
}

export default Logout;
