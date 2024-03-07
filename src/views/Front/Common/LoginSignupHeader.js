import React from "react";
import { ToastContainer } from "react-toastify";

const LoginSignupHeader = () => {
  return (
    <React.Fragment>
      <ToastContainer />
      <header>
        <div className="container-fluild px-5">
          <nav
            className="navbar navbar-light bg-transparent"
            style={{ zIndex: 9, bottom: 68 }}
          >
            <a className="navbar-brand" href="#">
              <img
                src={require("../../../assets/images/logo.png")}
                width="213"
                height="51"
                className="d-inline-block align-top"
                alt="iMagDent"
              />
            </a>
          </nav>
        </div>
      </header>
    </React.Fragment>
  );
};

export default LoginSignupHeader;
