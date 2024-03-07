import React, { Component } from "react";
import { Col, Row, Button } from "reactstrap";
import message from "../../../services/message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      messages: [],
      isLoader: true,
      hasMore: false,
      showModal: false,
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false,
      fields: { id: [] },
      isCheckAll: false,
      callMethod: this.props.callMethod
    };
  }
  selectAll = e => {
    let fields = this.state.fields;
    let isCheckAll = this.state.isCheckAll;
    let { checked } = e.target;
    if (checked) {
      this.props.folders.map((v, i) => {
        fields["id"][i] = v.message.id;
        fields[v.message_id] = true;
      });
      isCheckAll = true;
    } else {
      this.props.folders.map((v, i) => {
        fields["id"] = [];
        fields[v.message_id] = false;
      });
      isCheckAll = false;
    }
    this.setState({ fields, isCheckAll });
    this.props.selectedMessage(this.state.fields);
  };
  selectMessage = () => {
    let fields = this.state.fields;
    let isCheckAll = this.state.isCheckAll;
    let { msgId, msgValue, isChecked } = this.props;
    if (isChecked) {
      fields["id"].push(msgValue);
      fields[msgId] = true;
      isCheckAll =
        fields["id"].length === this.props.folders.length ? true : false;
    } else {
      let indexToRemove = fields["id"].indexOf(msgValue);
      fields["id"].splice(indexToRemove, 1);
      fields[msgId] = false;
      isCheckAll = false;
    }

    this.setState({ fields, isCheckAll });
    this.props.selectedMessage(this.state.fields);
  };
  handleDelete = () => {
    let params = {
      fields: this.state.fields
    };
    message.deleteMessage(params).then(response => {
      if (response.data.success) {
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
        this.props.getMessages();
        this.props.getNewMessagesCount();
        this.setState({ isCheckAll: false });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };
  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.callMethod !== prevState.callMethod) {
      this.selectMessage();
    }
  };
  handlePageChange = e => {
    this.setState(
      //prevState => ({ page: e, isCheckAll: !prevState.isCheckAll }),
      { page: e },
      () => {
        this.props.getMessages(this.state.page);
      }
    );
  };
  render() {
    return (
      <Row>
        <Col md={4}>
          <Button
            className="btn-sm m-1"
            style={{ paddingTop: 6, paddingBottom: 2 }}
          >
            <input
              type="checkbox"
              onChange={this.selectAll}
              name="checkAll"
              checked={this.state.isCheckAll}
            />
          </Button>
          {this.props.sync && (
            <Button
              className="btn-sm m-1"
              onClick={() => this.props.getMessages()}
            >
              <FontAwesomeIcon icon="sync" spin={false} />
            </Button>
          )}
          {this.props.trash && (
            <Button
              className="btn-sm m-1"
              onClick={this.handleDelete}
              disabled={this.state.fields["id"].length == 0}
            >
              <FontAwesomeIcon icon="trash" />
            </Button>
          )}
        </Col>
        {this.props.totalItemsCount > 20 && (
          <Col md={8} className="text-right">
            <Pagination
              activePage={this.state.page}
              itemsCountPerPage={this.props.pageSize}
              totalItemsCount={parseInt(this.props.totalItemsCount)}
              onChange={this.handlePageChange}
            />
          </Col>
        )}
      </Row>
    );
  }
}

export default Header;
