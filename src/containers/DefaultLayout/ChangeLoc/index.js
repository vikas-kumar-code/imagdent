import React, { Component } from "react";
import {
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import store from "../../../store/store";
import { toast } from "react-toastify";
import common from "../../../services/common";
import LoadingOverlay from "react-loading-overlay";
import ChangeLocation from "./ChangeLocation";
import { connect } from "react-redux";
import { changeLocation } from "../../../store/actions";
import user from "../../../services/user";

class ChangeLoc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      enableSelection: false,
      locations: [],
      loader: true,
      defaultLocation: this.props.defaultLocation,
    };
  }
  componentDidMount = () => {
    common.getUserLocations().then((response) => {
      if (response.data.success) {
        this.setState({ locations: response.data.locations, loader: false });
      }
    });
  };

  changeDefaultLocation = () => {
    let location_id = this.state.defaultLocation;
    this.setState({ submitted: true });
    user
      .changeDefaultLocation({ location_id: location_id })
      .then((response) => {
        if (response.data.success) {
          this.setState({ submitted: false }, () => {
            this.props.changeLocation({ defaultLocation: location_id });
            this.props.toggleModal();
            localStorage.setItem("defaultLocation", location_id);
            toast.success("Location changed successfully", {
              position: toast.POSITION.TOP_RIGHT,
            });
          });
        } else {
          this.props.toggleModal();
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
  };

  setLocation = (location_id) => {
    this.setState({ defaultLocation: location_id });
  };
  render() {
    return (
      <Modal isOpen={this.props.showModal} size="lg">
        <ModalHeader toggle={this.props.toggleModal}>
          Change Location
        </ModalHeader>
        <ModalBody style={{ minHeight: 250 }}>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Row>
              {this.state.locations ? (
                this.state.locations.length > 0 &&
                this.state.locations.map((loc, index) => (
                  <ChangeLocation
                    key={`loc-index-${index}`}
                    loc={loc}
                    defaultLocation={this.state.defaultLocation}
                    setLocation={this.setLocation}
                  />
                ))
              ) : (
                <p className="ml-4">No Location found.</p>
              )}
            </Row>
          </LoadingOverlay>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" size="sm" onClick={this.props.toggleModal}>
            Cancel
          </Button>
          <Button
            color="success"
            size="sm"
            onClick={this.changeDefaultLocation}
            disabled={this.state.submitted}
          >
            {this.state.submitted && (
              <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
            )}{" "}
            Update
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    defaultLocation: state.defaultLocation,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeLocation: (data) => {
      dispatch(changeLocation(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeLoc);
