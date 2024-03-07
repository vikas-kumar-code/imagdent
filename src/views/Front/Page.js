import React, { Component } from "react";
import { Link } from "react-router-dom";
import http from "../../services/http";
import { Col, Row, Spinner } from "reactstrap";
import { Helmet } from "react-helmet";

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {},
      loader: true
    };
  }

  getPage = () => {
    let name = this.props.location.pathname.split("/");
    let data = {
      url: name[1]
    };
    var that = this;
    http
      .get("/page/get-one-by-name", { params: data })
      .then(function(response) {
        that.setState({ loader: false, page: response.data.content });
        let errors = {};
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  componentDidMount() {
    this.getPage();
  }
  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Singup : iMagDent</title>
        </Helmet>

        <div id="lp-register">
          <div className="container wrapper">
            <Row className="mt-5">
              <Col sm={4} md={4} lg={4}>
                <h2 className="privacy-protected">
                  A powerful privacy-protected social platform for civic
                  engagement
                </h2>
                <Link
                  to="/login"
                  className="btn btn-warning Register-btn text-uppercase"
                >
                  Log In
                </Link>
              </Col>
              <Col sm={7} md={7} lg={7} className="mx-auto">
                <div className="card log-reg-area">
                  <div className="log-reg">
                    <h2 className="login-title text-center mt-5">
                      <b>Terms And Conditions</b>
                    </h2>
                    {this.state.loader ? (
                      <p className="text-center">
                        <Spinner />
                      </p>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: this.state.page.content
                        }}
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Page;
