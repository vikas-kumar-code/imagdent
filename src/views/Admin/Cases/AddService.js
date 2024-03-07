import React, { Component } from "react";
import common from "../../../services/common";
import ccase from "../../../services/case";
import {
  Col,
  FormGroup,
  Label,
  Form,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import Select from "react-select";
import { toast } from "react-toastify";

class AddService extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clinics: [],
      services: [],
      loader: false,
      fields: {
        case_id: this.props.caseId,
      },
      errors: {},
      submitted: false,
      loader: true,
    };
  }
  componentDidMount = () => {
    let fields = this.state.fields;
    fields["who_will_pay"] = this.props.who_will_pay;
    let caseServiceIdList = this.props.caseServicesList.map(
      (v) => v.service.id
    );
    common.getServices().then((response) => {
      if (response.data.success) {
        this.setState({ services: response.data.services });
        let options = [];
        response.data.services.forEach((s, i) => {
          options[i] = {
            label: s.name,
            options: [],
          };
          if (s.child.length > 0) {
            s.child
              .filter((c) => !caseServiceIdList.includes(c.id))
              .map((child, index) => {
                let chxLoc =
                child.locations !== null && child.locations.length > 0 && child.locations.split(", ");
                let location =
                  chxLoc.length > 0 &&
                  chxLoc.filter(
                    (loc) =>
                      parseInt(loc.location_id) ==
                      parseInt(this.props.locationId)
                  );
                let locPrice =
                  location.length > 0 && location[0].price !== null
                    ? {
                        price: location[0].price,
                        location_id: this.props.locationId,
                      }
                    : { price: child.price, location_id: 0 };
                options[i]["options"][index] = {
                  label: `${child.name} - $${locPrice.price}`,
                  value: child.id,
                  location_id: locPrice.location_id,
                  price: locPrice.price,
                };
              });
          }
        });
        this.setState({ options, fields, loader: false });
      }
    });
  };
  handleServiceChange = (data) => {
    let fields = this.state.fields;
    fields["service_id"] = data;
    this.setState({ fields });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      let params = { fields: this.state.fields };
      let that = this;
      ccase
        .addService(params)
        .then((response) => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              this.props.toggleServiceModal();
              this.props.getServices(this.props.caseId);
            }
          });
        })
        .catch(function (error) {
          that.setState({ submitted: false });
        });
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (fields["service_id"] == null) {
      formIsValid = false;
      errors["service_id"] = "Please select one service";
    }
    this.setState({ errors });
    return formIsValid;
  };
  handleChange = (e) => {
    let fields = this.state.fields;
    if (e.target.type === "radio") {
      if (e.target.checked) {
        fields["who_will_pay"] = e.target.value;
      }
    }
    this.setState({ fields });
  };
  render() {
    const { fields } = this.state;
    return (
      <Modal isOpen={this.props.showServiceModal}>
        <ModalHeader toggle={this.props.toggleServiceModal}>
          Add Service
        </ModalHeader>
        <Form name="service-frm" method="post" onSubmit={this.handleSubmit}>
          <ModalBody>
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <FormGroup row>
                <Col md={12}>
                  <Label>Choose Service</Label>
                  <Select
                    name="service_id"
                    value={fields["service_id"] ? fields["service_id"] : []}
                    options={this.state.options}
                    onChange={this.handleServiceChange}
                  />
                  {this.state.errors["service_id"] && (
                    <small className="fa-1x text-danger">
                      {this.state.errors["service_id"]}
                    </small>
                  )}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col md={12}>
                  <Label check>
                    <input
                      type="radio"
                      name="who_will_pay"
                      value="0"
                      checked={fields["who_will_pay"] == "0" ? true : false}
                      onChange={this.handleChange}
                    />{" "}
                    Doctor
                  </Label>

                  <Label check className="ml-3">
                    <input
                      type="radio"
                      name="who_will_pay"
                      value="1"
                      checked={fields["who_will_pay"] == "1" ? true : false}
                      onChange={this.handleChange}
                    />{" "}
                    Patient
                  </Label>
                </Col>{" "}
              </FormGroup>
            </LoadingOverlay>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-dark cp mr-1"
              disabled={this.state.submitted}
              onClick={this.props.toggleServiceModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-danger cbd-color cp"
              disabled={this.state.submitted}
            >
              {this.state.submitted && (
                <FontAwesomeIcon icon="spinner" className="mr-1" spin={true} />
              )}
              Save
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default AddService;
