import React, { Component } from "react";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import Scrollbars from "react-custom-scrollbars";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
  Button,
  Table,
} from "reactstrap";
import message from "../../../services/message";
import Message from "./Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import Header from "./Header";
import { connect } from "react-redux";
//import { updateNewMessagesCount } from "../../../store/actions";

class Inbox extends Component {
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
      showModal: false,
      documentTypeId: "",
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false,
      fields: { id: [] },
      callMethod: false,
    };
  }

  updateSearchFields = (fields) => {
    this.setState({ fields });
  };
  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getDocumentTypes();
    });
  };

  componentDidMount = () => {
    this.getInbox();
  };

  getInbox = (page) => {
    this.setState({ isLoader: true });
    let params = { pageSize: this.state.pageSize, page: page };
    message.getInbox(params).then((response) => {
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
          /*this.props.updateNewMessagesCount({
            totalNewMessages: response.data.folders.length
          });*/
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
        <CardHeader className="bg-primary">
          <h5 className="mb-0">Inbox</h5>
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
                getMessages={this.getInbox}
                msgId={this.state.msgId}
                msgValue={this.state.msgValue}
                isChecked={this.state.isChecked}
                sync={true}
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
                            selectMessage={this.selectMessage}
                            messageType="I"
                            fields={this.state.fields[folder.message_id]}
                            getNewMessagesCount={this.props.getNewMessagesCount}
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
/*const mapStateToProps = state => {
  return {
    totalNewMessages: state.totalNewMessages
  };
};
const mapDispatchToProps = dispatch => {
  return {
    updateNewMessagesCount: data => {
      dispatch(updateNewMessagesCount(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inbox);*/
export default Inbox;
