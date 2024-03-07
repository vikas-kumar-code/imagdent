import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import Navigation from "./Navigation";
import Banners from "./Banners";
import Faq from "./Faq";
import Pages from "./Pages";
import AddEditContent from "./AddEditContent";
import { Helmet } from "react-helmet";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import AddEditFaq from "./AddEditFaq";

class FrontEndSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
    };
  }

  componentDidMount = () => {
    let url = this.props.match.path.split("/");
    this.setState({url:url});
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>
            {this.state.url === null ? "Banners" : this.state.url.length === 4 ? this.state.url[3].toUpperCase():"Front-End Setting" } : iMagDent
          </title>
        </Helmet>
        <Row>
          <Col xl={3}>
            <Navigation />
          </Col>
          <Col xl={9}>
            <Switch>
              <Route
                key={0}
                path="/admin/front-end-settings/banners"
                exact={true}
                render={(props) => <Banners {...props} />}
              />
              <Route
                key={1}
                path="/admin/front-end-settings/pages"
                exact={true}
                render={(props) => <Pages {...props} />}
              />
              <Route
                key={2}
                path="/admin/front-end-settings/pages/add"
                exact={true}
                render={(props) => <AddEditContent {...props} />}
              />
              <Route
                key={0}
                path="/admin/front-end-settings/pages/add/:id"
                exact={true}
                render={(props) => <AddEditContent {...props} />}
              />
              <Route
                key={3}
                path="/admin/front-end-settings/faq"
                exact={true}
                render={(props) => <Faq {...props} />}
              />
              <Route
                key={0}
                path="/admin/front-end-settings/faq/add"
                exact={true}
                render={(props) => <AddEditFaq {...props} />}
              />
              <Route
                key={0}
                path="/admin/front-end-settings/faq/add/:id"
                exact={true}
                render={(props) => <AddEditFaq {...props} />}
              />
            </Switch>
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  };
};
export default connect(mapStateToProps)(FrontEndSettings);
