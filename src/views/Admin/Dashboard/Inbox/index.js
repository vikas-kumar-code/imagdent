import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import LoadingOverlay from "react-loading-overlay";
import { Spinner, Table, Card, CardBody, CardHeader } from "reactstrap";
import common from "../../../../services/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import moment from "moment";
import message from "../../../../services/message";

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folders: [],
      loader: true,
    };
  }
  getRecepientName = (folders) => {
    folders = [
      ...new Map(folders.map((item) => [item["user_id"], item])).values(),
    ];
    let names = [];
    folders.forEach((folder, index) => {
      names[index] = common.getFullName(folder.user);
    });
    return names.join(", ");
  };

  componentDidMount = () => {
    message.getInbox().then((response) => {
      if (response.data.success) {
        this.setState({ loader: false });
        let unreadMessage = response.data.folders.filter(
          (ele) => ele.read_message == "N"
        );
        this.setState({
          folders: unreadMessage,
        });
      }
    });
  };

  render() {
    return (
      <Card className="border-light shadow" style={{ height: "340px" }}>
        <CardHeader className="bg-primary">
          <strong>Inbox</strong>
        </CardHeader>
        <CardBody>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Scrollbars style={{ minHeight: 250 ,maxHeight:250}} className >
              <Table responsive className="table-striped">
                <thead>
                  <tr>
                    <th scope="col" className="border-top-0">
                      From
                    </th>
                    <th scope="col" className="border-top-0">
                      Subject
                    </th>
                    <th scope="col" className="border-top-0" />
                    <th scope="col" className="border-top-0">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.folders.length > 0 ? (
                    this.state.folders.map((record, i) => (
                      <tr key={i + 1}>
                        <td>
                          <Link
                            to={`${`/admin/messages/read/${record.message_id}/I`}`}
                            className="font-weight-bold"
                          >
                            {this.getRecepientName(record.message.folders)}
                          </Link>
                        </td>
                        <td>
                          <Link
                            to={`${`/admin/messages/read/${record.message.id}/I`}`}
                            className="font-weight-bold"
                          >
                            {record.message.subject}
                          </Link>
                        </td>
                        <td>
                          {" "}
                          {record.message["attachments"] !== null ? (
                            <FontAwesomeIcon
                              icon="paperclip"
                              className="mr-5"
                            />
                          ) : record["attachments"] ? (
                            <FontAwesomeIcon
                              icon="paperclip"
                              className="mr-5"
                            />
                          ) : (
                            ""
                          )}
                        </td>
                        <td>{moment(record.message.added_on).format("LLL")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td key={0} colSpan="5">
                        <p className="text-center">No new message found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Scrollbars>
          </LoadingOverlay>
        </CardBody>
      </Card>
    );
  }
}
export default Inbox;
