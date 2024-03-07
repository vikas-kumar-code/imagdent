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
  ModalFooter
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import Select from "react-select";
import { toast } from "react-toastify";

class ChangePayee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinics: [],
      service: [],
      loader: false,
      fields: {
        id: this.props.cserviceId,
        case_id: this.props.caseId,
        clinic_id: []
      },
      errors: {},
      submitted: false
    };
  }

  componentDidMount = () => {
    this.setState({ loader: true });
    let params = {
      case_id: this.props.caseId,
      id: this.props.cserviceId
    };
    ccase.getServiceDetails(params).then(response => {
      if (response.data.success) {
        let fields = this.state.fields;
        let service = response.data.service;
        fields["who_will_pay"] = service.who_will_pay;
        fields["location_id"] = service.location_id;
        fields["service_id"] = service.service_id;
        fields["price"] = service.price;
        fields["clinic_id"] = {
          label: service.cases.clinic.name,
          value: service.cases.clinic.id
        };
        this.setState({ fields });
      }
    });
    common.getClinicsByUser({ user: this.props.user }).then(response => {
      let clinics = [];
      if (response.data.success) {
        response.data.clinics.forEach((clinic, index) => {
          clinics[index] = {
            label: clinic.name,
            value: clinic.id
          };
        });
        this.setState({ clinics, loader: false });
      }
    });
  };

  handleChange = e => {
    let fields = this.state.fields;
    if (e.target.type === "radio") {
      if (e.target.checked) {
        fields["who_will_pay"] = e.target.value;
      }
    }
    this.setState({ fields });
  };

  handleClinicChange = clinic => {
    let fields = this.state.fields;
    fields["clinic_id"] = { label: clinic.label, value: clinic.value };
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitted: true });
    let that = this;
    let params = { fields: this.state.fields };
    ccase
      .changePayee(params)
      .then(response => {
        if (response.data.success) {
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
          this.props.togglePayeeModal();
        } else if (response.data.error) {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      })
      .catch(function(error) {
        that.setState({ submitted: false });
      });
  };

  render() {
    const { fields } = this.state;
    return (
      <Modal isOpen={this.props.showPayeeModal}>
        <ModalHeader toggle={this.props.togglePayeeModal}>
          Change Payee
        </ModalHeader>{" "}
        <Form name="payee-frm" method="post" onSubmit={this.handleSubmit}>
          <ModalBody className="pl-4 pr-4">
            <div className="animated fadeIn">
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                <FormGroup row>
                  <Col md={6}>
                    <Label check>
                      <input
                        type="radio"
                        name="who_will_pay"
                        value="0"
                        checked={fields["who_will_pay"] === "0" ? true : false}
                        onChange={this.handleChange}
                      />{" "}
                      Doctor
                    </Label>

                    <Label check className="ml-3">
                      <input
                        type="radio"
                        name="who_will_pay"
                        value="1"
                        checked={fields["who_will_pay"] === "1" ? true : false}
                        onChange={this.handleChange}
                      />{" "}
                      Patient
                    </Label>
                  </Col>{" "}
                </FormGroup>
                {fields["who_will_pay"] === "0" && (
                  <FormGroup className="select-lg">
                    <Label>Clinic</Label>
                    <Select
                      name="clinic_id"
                      value={fields["clinic_id"] ? fields["clinic_id"] : []}
                      options={this.state.clinics}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={this.handleClinicChange}
                    />
                  </FormGroup>
                )}
              </LoadingOverlay>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-dark cp mr-1"
              disabled={this.state.submitted}
              onClick={this.props.togglePayeeModal}
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

export default ChangePayee;
