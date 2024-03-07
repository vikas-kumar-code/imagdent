import React, { Component } from "react";
import patient from "../../../services/patient";
import user from "../../../services/user";
import common from "../../../services/common";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  FormFeedback,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Teeth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      teeth: [],
      selectedTeeth: [],
      addClass: false,
    };
  }
  handleToothSelect = (e) => {
    let selectedTeeth = this.state.selectedTeeth;
    if (selectedTeeth.includes(`${e.target.title}`)) {
      e.target.className = `teeth_${e.target.title}_default`;
      let teethToBeRemoved = selectedTeeth.indexOf(e.target.title);
      selectedTeeth.splice(teethToBeRemoved, 1);
    } else {
      e.target.className = `teeth_${e.target.title}_selected`;
      selectedTeeth.push(e.target.title);
    }
    this.setState({ selectedTeeth }, () => {
      this.props.updateSelectedTeeth(selectedTeeth);
    });
  };
  componentDidMount = () => {
    let teeth = [];
    let selectedTeeth = this.props.selectedTeeth;
    this.setState({ selectedTeeth }, () => {
      for (var i = 1; i <= 32; i++) {
        teeth[i] = {
          id: i,
          src: `${i}.jpg`,
          className: this.state.selectedTeeth.includes(`${i}`)
            ? `teeth_${i}_selected`
            : `teeth_${i}_default`,
          selected: this.state.selectedTeeth.includes(`${i}`) ? true : false,
        };
      }
      this.setState({ teeth });
    });
    this.setState({ addClass: !this.state.addClass });
    setTimeout(() => {
      this.setState({ loader: false });
    }, 1000);
  };
  render() {
    return (
      <React.Fragment>
        {this.state.loader ? (
          <Spinner color="dark" className="mt-5" />
        ) : (
          <ul className="tooth-image">
            {this.state.teeth.slice(0, 33).map((tooth, index) => (
              <li key={`teeth-key-${index}`} className="">
                <span
                  className={tooth.className}
                  onClick={this.handleToothSelect}
                  title={tooth.id}
                />
              </li>
            ))}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  };
};
export default connect(mapStateToProps)(Teeth);
