import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Slider from "./Slider";
import Testimonial from "./Testimonial";
import PatientInformation from "./PatientInformation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import General_services from './General_services';
import Welcome_Imagdent from './Welcome_Imagdent';
import Choose_us from './Choose_us';
import Patient_Testimonials from './Patient_Testimonials';
import Achieved from './Achieved';
import Patient_Information from './Patient_Information';
import Contact from './Contact';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      overLayLoader: true
    };
  }
  componentDidMount = () => {
    window.scrollTo(0, 0);
  };
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Home - iMagDent</title>
        </Helmet>
        <div className="page-content">
          <Slider />
          <Welcome_Imagdent/>
          <General_services/>
          <Choose_us/>
          <Patient_Testimonials/>
          <Achieved/>
          <Patient_Information/>
          <Contact/>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userType: state.userType
  };
};
export default connect(mapStateToProps)(Home);
