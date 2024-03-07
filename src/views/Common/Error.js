import React from "react";
import { Col, Row } from "reactstrap";

class Error extends React.Component {
    render() {
        return <div className="animated fadeIn">
            <Row>
                <Col xl={12}>
                    <div className="justify-content-center row">
                        <div className="col-md-6">
                            <div className="clearfix">
                                <h1 className="float-left display-3 mr-4">403</h1>
                                <h4 className="pt-3">You are not allowed to perform this action.</h4>
                                <p className="text-muted float-left">Request failed with status code 403</p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>;
    }
}

export default Error;
