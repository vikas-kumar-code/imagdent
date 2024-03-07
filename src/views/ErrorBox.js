import React from "react";
import { Helmet } from "react-helmet";
import { Col, Row } from "reactstrap";

class ErrorBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hasError:false,
    }
  }
  static getDerivedStateFromError(error){
    return {
      hasError:true
    };
  }
  componentDidCatch(error, errorInfo){
    console.log(error, errorInfo);
  }
  render() {
    if(this.state.hasError){
      return (
        <div className="animated fadeIn">
          <Helmet>
            <title>Error : iMagDent</title>
          </Helmet>
          <Row>
            <Col xl={12}>
              <div className="justify-content-center row">
                <div className="col-md-6">
                  <div className="clearfix">
                    <h1 className="float-left display-3 mr-4">403</h1>
                    <h4 className="pt-3">
                      You are not allowed to perform this action.
                    </h4>
                    <p className="text-muted float-left">
                      Request failed with status code 403
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    else{
      return (
        <div className="animated fadeIn">
          <Helmet>
            <title>Error : iMagDent</title>
          </Helmet>
          <Row>
            <Col xl={12}>
              <div className="justify-content-center row">
                <div className="col-md-6">
                  <div className="clearfix">
                    <h1 className="float-left display-3 mr-4">403</h1>
                    <h4 className="pt-3">
                      You are not allowed to perform this action.
                    </h4>
                    <p className="text-muted float-left">
                      Request failed with status code 403
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    //return this.props.children;
  }
}

export default ErrorBox;
