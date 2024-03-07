import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

class Doctors extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0);
  };
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Doctors - iMagDent</title>
        </Helmet>
        <div className="page-content">
        <div className="section mt-0">
			<div className="breadcrumbs-wrap">
				<div className="container">
					<div className="breadcrumbs">
						<Link to="/">Home</Link>
						<span>Doctors</span>
					</div>
				</div>
			</div>
        </div>
        <div className="section page-content-first">
			<div className="container">
				<div className="text-center mb-2  mb-md-3 mb-lg-4">
					<div className="h-sub theme-color">What We Offer</div>
					<h1>Our Services</h1>
					<div className="h-decor"></div>
					<div className="text-center mt-4">
						<p>All these services are rendered to enable patients enjoy a healthy life style where they feel no hesitation
							<br/>in displaying their beautiful smile</p>
					</div>
				</div>
            </div>
        </div>
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
export default connect(mapStateToProps)(Doctors);
