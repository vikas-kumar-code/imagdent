import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Row, Col, Spinner } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import { Link } from "react-router-dom";
import http from "../../../services/http";

class AboutUs extends Component {
  state = {
    page: {},
    loader: true,
    notFound: false,
  };

  getPage = () => {
    let name = this.props.location.pathname.split("/");
    let data = {
      url: name[1],
    };
    var that = this;
    http
      .get(`/page/get-by-name`, { params: data })
      .then(function (response) {
        that.setState({ loader: false, page: response.data.content });
      })
      .catch(function (error) {
        this.setState({ loader: false, notFound: true });
      });
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getPage();
  };
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title> Poll : iMagDent</title>
        </Helmet>

        <div className="page-content">
          <div className="section mt-0">
            <div className="breadcrumbs-wrap">
              <div className="container">
                <div className="breadcrumbs">
                  <Link to="/">Home</Link>
                  <span>About Us</span>
                </div>
              </div>
            </div>
          </div>
          <div className="section mt-2">
            <div className="container">
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
               >
                <div className="mb-2 mb-md-3 mb-lg-4">
                  <h1>{this.state.page.name}</h1>
                  <div className="h-decor" />
                  <div className="my-4">
                    <Row>
                      <Col sm={8}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: this.state.page.content,
                          }}
                        />
                      </Col>
                      <Col sm={4}>
                        <div>
                          <iframe
                            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FimagdentSAT&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId"
                            width="100%"
                            height="500"
                            style={{ border: "none", overflow: "hidden" }}
                            scrolling="no"
                            frameborder="0"
                            allowfullscreen="true"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          ></iframe>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </LoadingOverlay>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userType: state.userType,
  };
};
export default connect(mapStateToProps)(AboutUs);
