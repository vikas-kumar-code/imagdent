import React, { Component } from "react";
import common from "../../../services/common";
import ccase from "../../../services/case";
import {
  Col,
  FormGroup,
  Input,
  Label,
  Form,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormFeedback
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import { toast } from "react-toastify";

class AddDiscount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      fields: {
        service_id: this.props.serviceId,
        case_id: this.props.caseId,
        discount: this.props.discount,
        reason: this.props.reason
      },
      errors: {},
      submitted: false
    };
  }
  componentDidMount = () => {
    setTimeout(() => this.setState({ loader: false }), 2000);
  };

  handleChange = e => {
    let fields = this.state.fields;
    let { name, value } = e.target;
    fields[name] = value;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      let params = { fields: this.state.fields };
      let that = this;
      ccase
        .addDiscount(params)
        .then(response => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
              });
              this.props.toggleDiscountModal();
              this.props.getServices(this.props.caseId);
              this.props.getPayments(this.props.caseId)
            } else if (response.data.error) {
              this.setState({ errors: response.data.message });
              toast.error(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
              });
            }
          });
        })
        .catch(function(error) {
          that.setState({ submitted: false });
        });
    }
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["discount"]) {
      formIsValid = false;
      errors["discount"] = "Amount can not be blank";
    }
    if (!fields["reason"]) {
      formIsValid = false;
      errors["reason"] = "Reason can not be blank";
    }
    this.setState({ errors });
    return formIsValid;
  };

  render() {
    const { fields, errors } = this.state;
    return (
      <Modal isOpen={this.props.showDiscountModal}>
        <ModalHeader toggle={this.props.toggleDiscountModal}>
          Add Discount
        </ModalHeader>{" "}
        <Form name="discount-frm" method="post" onSubmit={this.handleSubmit}>
          <ModalBody className="pl-4 pr-4">
            <div className="animated fadeIn">
              <LoadingOverlay
                active={this.state.loader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
              >
                <FormGroup row>
                  <Col md={12}>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      name="discount"
                      value={
                        fields["discount"] !== "0.00" ? fields["discount"] : ""
                      }
                      onChange={this.handleChange}
                      invalid={errors["discount"] ? true : false}
                    />
                    {errors["discount"] && (
                      <FormFeedback>{errors["discount"]}</FormFeedback>
                    )}
                  </Col>{" "}
                </FormGroup>
                <FormGroup row>
                  <Col md={12}>
                    <Label>Reason</Label>
                    <Input
                      type="textarea"
                      name="reason"
                      value={fields["reason"] ? fields["reason"] : ""}
                      onChange={this.handleChange}
                      invalid={errors["reason"] ? true : false}
                    />
                    {errors["reason"] && (
                      <FormFeedback>{errors["reason"]}</FormFeedback>
                    )}
                  </Col>
                </FormGroup>
              </LoadingOverlay>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-outline-dark cp mr-1"
              disabled={this.state.submitted}
              onClick={this.props.toggleDiscountModal}
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

export default AddDiscount;
