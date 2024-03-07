import React, { Component } from "react";
import referral from "../../../services/referral";
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
    Collapse,

} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ChooseSummary from "./ChooseSummary"


class UpdateStatus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: false,
            fields: { referral_details: this.props.referral, referral_id: this.props.referral.id, status: this.props.referral.status },
            errors: {},
            submitted: false,
            showSummary: false
        };
    }
    handleChange = (field, e) => {
        let showSummary = false;
        let fields = this.state.fields;
        if (e.target.type === "radio") {
            fields[field] = e.target.value;
            if (e.target.checked && e.target.value == "8") {
                showSummary = true
                this.setState({ fields, showSummary });
            }
        } else {
            fields[field] = e.target.value;
            this.setState({ fields });
        }
    };
    handleSubmit = e => {
        e.preventDefault();
        let frm = e.target.attributes.name.value;
        if (this.handleValidation(frm)) {
            this.setState({ submitted: true });
            const params = {
                fields: this.state.fields,
            };
            referral.changeStatus(params).then(response => {
                this.setState({ submitted: false }, () => {
                    if (response.data.success) {
                        toast.success(response.data.message, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        this.props.toggleModal();
                        this.props.getReferrals();
                    } else if (response.data.error) {
                        let errors = {};
                        if (response.data.message.name) {
                            errors["name"] = response.data.message.name[0];
                        }
                        this.setState({ errors: errors });
                    }
                });
            });
        };
    }
    handleValidation = (frm) => {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;
        if (!fields["status"]) {
            formIsValid = false;
            errors["status"] = "Please choose status.";
        }
        this.setState({ errors: errors });
        return formIsValid;
    };
    updateTreatmentSummary = (treatment_summary) => {
        let fields = this.state.fields;
        fields["treatment_summary"] = treatment_summary;
        this.setState({ fields });
    }
    render() {
        return (
            <Modal isOpen={this.props.showModal} size="lg">
                <ModalHeader toggle={this.props.toggleModal}>Update Status</ModalHeader>
                <ModalBody className="pl-4 pr-4">
                    <div className="animated fadeIn">
                        <LoadingOverlay
                            active={this.state.loader}
                            spinner={<Spinner color="dark" />}
                            fadeSpeed={200}
                            classNamePrefix="mitiz"
                        >
                            <Form
                                name="update-status"
                                method="post"
                                onSubmit={this.handleSubmit}
                            >
                                <FormGroup check inline>
                                    <Label><Input type="radio" name="status" value="5" onChange={event => this.handleChange("status", event)} /> Patient Info. Received</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label><Input type="radio" name="status" value="6" onChange={event => this.handleChange("status", event)} /> Consultation</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label><Input type="radio" name="status" value="7" onChange={event => this.handleChange("status", event)} /> Procedure</Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label><Input type="radio" name="status" value="8" onChange={event => this.handleChange("status", event)} /> Patient Therapy Completed</Label>
                                </FormGroup>
                                {this.state.errors["status"] && (
                                    <FormGroup><small className="fa-1x text-danger">{this.state.errors["status"]}</small></FormGroup>
                                )}
                                <Collapse isOpen={this.state.showSummary}>
                                    <ChooseSummary referral={this.props.referral} updateTreatmentSummary={this.updateTreatmentSummary} />
                                </Collapse>
                                <FormGroup>
                                    <Input
                                        type="textarea"
                                        name="notes"
                                        id="notes"
                                        value={
                                            this.state.fields["notes"]
                                                ? this.state.fields["notes"]
                                                : ""
                                        }
                                        onChange={event => this.handleChange("notes", event)}
                                        invalid={this.state.errors["notes"] ? true : false}
                                        className="mt-2"
                                        bsSize="lg"
                                        rows={3}
                                        placeholder="Add Note"
                                    />
                                    {this.state.errors["notes"] && (
                                        <FormFeedback>{this.state.errors["notes"]}</FormFeedback>
                                    )}
                                </FormGroup>
                                <Row>
                                    <Col md={12} className="text-right">
                                        <button
                                            type="button"
                                            className="btn btn-outline-dark cp mr-1"
                                            disabled={this.state.submitted}
                                            onClick={this.props.toggleModal}
                                        >
                                            Cancel
                    </button>
                                        <button
                                            type="submit"
                                            className="btn btn-danger cbd-color cp"
                                            disabled={this.state.submitted}
                                        >
                                            {this.state.submitted && (
                                                <FontAwesomeIcon
                                                    icon="spinner"
                                                    className="mr-1"
                                                    spin={true}
                                                />
                                            )}
                                            Update
                                        </button>
                                    </Col>
                                </Row>
                            </Form>
                        </LoadingOverlay>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        baseUrl: state.baseUrl,
        userId: state.userId,
    };
};
export default connect(mapStateToProps)(UpdateStatus);
