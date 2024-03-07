import React, { Component } from "react";
import page from "../../../services/page";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Row, Col, Spinner } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import { Link } from "react-router-dom";
import Container from "reactstrap/lib/Container";
import Slider from "../Home/Slider";
class StateContent extends Component {
  state = {
    page: {},
    loader: true,
    notFound: false,
  };

  getPage = (url) => {
    page.getOneByName({ url: url }).then((response) => {
      if (response.data.success) {
        this.setState({ loader: false, page: response.data.content });
      } else if (response.data.error) {
        this.setState({ loader: false, notFound: true });
      }
    });
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.match.params.url) {
      this.getPage(this.props.match.params.url);
    }else{
      page.getOneByName({ url: "home" }).then((response) => {
        if (response.data.success) {
          this.setState({ loader: false, page: response.data.content });
        } else if (response.data.error) {
          this.setState({ loader: false, notFound: true });
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.url !== this.props.match.params.url) {
      this.getPage(this.props.match.params.url);
    }
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>
            {this.props.match.url === "/"
              ? "HOME"
              : this.props.match.params.url.toUpperCase()}{" "}
            : iMagDent
          </title>
        </Helmet>
        <div className="page-content">
          {this.props.match.url !== "/" && (
            <div className="section mt-0">
              <div className="breadcrumbs-wrap">
                <div className="container">
                  <div className="breadcrumbs">
                    <Link to="/">Home</Link>
                    <span>{this.state.page.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="section mt-2">
            {this.props.match.url !== "/" ? (
              <div className="container" style={{ minHeight: 650 }}>
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
                      <div
                        dangerouslySetInnerHTML={{
                          __html: this.state.page.content,
                        }}
                      />
                    </div>
                  </div>
                </LoadingOverlay>
              </div>
            ) : (
              <div>
                <Slider />
                <LoadingOverlay
                  active={this.state.loader}
                  spinner={<Spinner color="dark" />}
                  fadeSpeed={200}
                  classNamePrefix="mitiz"
                >
                  <div className="mb-2 mb-md-3 mb-lg-4">
                    <div className="my-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: this.state.page.content,
                        }}
                      />
                    </div>
                  </div>
                </LoadingOverlay>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  };
};

export default connect(mapStateToProps)(StateContent);
