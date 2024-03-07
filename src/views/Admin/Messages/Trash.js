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

class Trash extends Component {
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
    this.getTrash();
  };

  getTrash = (page) => {
    this.setState({ isLoader: true });
    let params = { pageSize: this.state.pageSize, page: page };
    message.getTrash(params).then((response) => {
      this.setState({ isLoader: false }, () => {
        if (response.data.success) {
          this.setState({
            folders: response.data.folders,
            totalItemsCount: response.data.pages.totalCount,
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
        <CardHeader className="bg-danger">
          <h5 className="mb-0">Deleted Messages</h5>
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
                sync={false}
                trash={false}
                folders={this.state.folders}
                selectedMessage={this.selectedMessage}
                getMessages={this.getTrash}
                msgId={this.state.msgId}
                msgValue={this.state.msgValue}
                isChecked={this.state.isChecked}
                callMethod={this.state.callMethod}
                pageSize={this.state.pageSize}
                totalItemsCount={this.state.totalItemsCount}
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

export default Trash;
