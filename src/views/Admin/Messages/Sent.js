import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  ListGroup,
  Spinner,
  ListGroupItem,
  Button,
  Badge,
  Table,
  CustomInput,
} from "reactstrap";
import message from "../../../services/message";
import Message from "./Message";
import Header from "./Header";
import Scrollbars from "react-custom-scrollbars";

class Sent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      folders: [],
      isLoader: false,
      pageNo: 1,
      pageSize: 20,
      totalItemsCount: 0,
      hasMore: false,
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false,
      fields: { id: [] },
      callMethod: false,
    };
  }

  componentDidMount = () => {
    this.getSent();
  };

  getSent = (page) => {
    this.setState({ isLoader: true });
    let params = { pageSize: this.state.pageSize, page: page };
    message.getSent(params).then((response) => {
      this.setState({ isLoader: false }, () => {
        if (response.data.success) {
          let fields = this.state.fields;
          fields["id"] = [];
          response.data.folders.map((v) => (fields[v.message_id] = false));
          this.setState({
            folders: response.data.folders,
            fields,
            isChecked: false,
            totalItemsCount:
              response.data.pages !== undefined
                ? response.data.pages.totalCount
                : 0,
          });
        }
      });
    });
  };

  selectMessage = (e) => {
    this.setState({
      msgId: e.target.id,
      msgValue: e.target.value,
      isChecked: e.target.checked,
      callMethod: true,
    });
  };
  selectedMessage = (msg) => {
    this.setState({
      fields: msg,
      callMethod: false,
    });
  };
  render() {
    return (
      <Card className="shadow" outline color="dark">
        <CardHeader className="bg-warning">
          <h5 className="mb-0">Sent Messages</h5>
        </CardHeader>
        <CardBody style={{ minHeight: 400 }}>
          <LoadingOverlay
            active={this.state.isLoader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <React.Fragment>
              <Header
                selectedMessage={this.selectedMessage}
                getMessages={this.getSent}
                msgId={this.state.msgId}
                msgValue={this.state.msgValue}
                isChecked={this.state.isChecked}
                sync={false}
                trash={true}
                folders={this.state.folders}
                callMethod={this.state.callMethod}
                pageSize={this.state.pageSize}
                totalItemsCount={this.state.totalItemsCount}
                getNewMessagesCount={this.props.getNewMessagesCount}
              />
              <Table responsive className="table-hover mt-3">
                <Scrollbars style={{ minHeight: 400 }}>
                  <tbody>
                    {this.state.folders.length > 0 ? (
                      this.state.folders.map((folder, index) => {
                        return (
                          <Message
                            folder={folder}
                            index={folder.id}
                            key={index}
                            messageType="S"
                            selectMessage={this.selectMessage}
                            fields={this.state.fields[folder.message_id]}
                          />
                        );
                      })
                    ) : (
                      <tr className="text-center">
                        <td width="5%">No Message Found!</td>
                      </tr>
                    )}
                  </tbody>
                </Scrollbars>
              </Table>
            </React.Fragment>
          </LoadingOverlay>
        </CardBody>
      </Card>
    );
  }
}

export default Sent;
