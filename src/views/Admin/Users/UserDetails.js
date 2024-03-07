import React, { Component } from "react";
import Error403 from "../../Error403";
import {
  Col,
  Row,
} from "reactstrap";
import { Helmet } from "react-helmet";
import UserDetailsBody from "./UserDetailsBody";

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error_403: false,
    };
  }

  render() {
    if (this.state.error_403) {
      return <Error403 />;
    }
    return (
      <div className="animated fadeIn">
        <Helmet>
          <title>User Details : Imagdent</title>
        </Helmet>
        <Row>
          <Col xl={12}>
            <UserDetailsBody id={this.props.match.params.id}
             enableEditDoctor={true}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserDetails;
