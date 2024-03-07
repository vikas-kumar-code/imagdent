import React, { Component } from "react";
import { CustomInput } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import common from "../../../services/common";
import { Link } from "react-router-dom";
import moment from "moment";

class Message extends Component {
  state = {
    showMenu: false,
  };

  newMessageCount = () => {
    if (this.props.getNewMessagesCount) {
      this.props.getNewMessagesCount();
    }
  };

  getFontWeight() {
    if (
      this.props.folder.read_message === "N" &&
      this.props.messageType === "I"
    ) {
      return "font-weight-bold";
    } else {
      return "font-weight-light";
    }
    // this.props.getNewMessagesCount()
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
  render() {
    const record = this.props.folder;
    return (
      <tr key={this.props.index}>
        <td width="5%">
          <CustomInput
            type="checkbox"
            id={record.message_id}
            onChange={this.props.selectMessage}
            value={record.message && record.message.id}
            checked={this.props.fields}
          />
        </td>
        <td
          onClick={this.newMessageCount}
        >
          <Link
            to={`${`/admin/messages/read/${record.message_id}/${this.props.messageType}`}`}
            className={this.getFontWeight()}
          >
            {this.getRecepientName(record.message.folders)}
          </Link>
        </td>
        <td
          onClick={this.newMessageCount}
        >
          <Link
            to={`${`/admin/messages/read/${record.message.id}/${this.props.messageType}`}`}
            className={this.getFontWeight()}
          >
            {record.message.subject}
          </Link>
        </td>
        <td className={`text-right ${this.getFontWeight()}`}>
          {record.message["attachments"] !== null ? (
            <FontAwesomeIcon icon="paperclip" className="mr-5" />
          ) : record["attachments"] ? (
            <FontAwesomeIcon icon="paperclip" className="mr-5" />
          ) : (
            ""
          )}
          {moment(record.message.added_on).format("LLL")}
        </td>
      </tr>
    );
  }
}

export default Message;
