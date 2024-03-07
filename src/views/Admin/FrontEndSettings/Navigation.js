import React, { Component } from "react";
import { ListGroup, ListGroupItem, Button, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";

class Folder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderCount: []
    };
  }
  render() {
    return (
      <React.Fragment>
        <ListGroup className="shadow">
          <ListGroupItem className="justify-content-between pl-2">
            <h3 className="mb-0">Links</h3>
          </ListGroupItem>
          <ListGroupItem
            action
            tag={Link}
            to={`/admin/front-end-settings/banners`}
            className={classnames({
              active: document.URL.indexOf("banners") > 0 
            })}
          >
            Banners
          </ListGroupItem>
          <ListGroupItem
            action
            tag={Link}
            to={`/admin/front-end-settings/pages`}
            className={classnames({
              active: document.URL.indexOf("pages") > 0 
            })}
          >
            Pages
          </ListGroupItem>
          <ListGroupItem
            action
            tag={Link}
            to={`/admin/front-end-settings/faq`}
            className={classnames({
              active: document.URL.indexOf("faq") > 0 
            })}
          >
            FAQ
          </ListGroupItem>
        </ListGroup>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    totalNewMessages: state.totalNewMessages
  };
};
export default connect(mapStateToProps)(Folder);
