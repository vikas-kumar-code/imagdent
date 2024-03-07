import React, { Component } from "react";
import patient from "../../../services/patient";
import { connect } from "react-redux";
import {
    Col, Row, Spinner, Button, Label, FormGroup, TabContent, TabPane, Nav, NavItem, NavLink, Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import classnames from 'classnames';
import Document from "./Document"
import ViewImage from "./ViewImage"

class ViewPatient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            fields: {},
            errors: {},
            submitted: false,
            loader: false,
            activeTab: "1",
            documents: [],
            imageSource: ""
        };
    }
    setActiveTab = (activeTab) => {
        if (activeTab !== this.state.activeTab) {
            this.setState({ activeTab });
        }
    }
    getPatient = id => {
        this.setState({ loader: true });
        patient.getOne({ id: id }).then(response => {
            if (response.data.success) {
                let fields = response.data.patient;
                //fields["BirthDate"] = response.data.patient.BirthDate !== "0000-00-00" ? new Date(response.data.patient.BirthDate) : "";
                let documents = response.data.patient.documents;
                this.setState({
                    fields, documents
                });
            } else if (response.data.error) {
                toast.error(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.setState({ loader: false });
        });
    };

    componentDidMount() {
        if (this.props.patientId) {
            this.getPatient(this.props.patientId);
        }
    }
    toggleSubModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
        }));
    };
    showImage = (e) => {
        this.setState({ imageSource: e.target.src, });
        this.toggleSubModal();
    }
    render() {
        return (
            <Modal isOpen={this.props.showModal} size="lg">
                <ModalHeader toggle={this.props.toggleModal}>Patient Details
          </ModalHeader>
                <ModalBody>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => this.setActiveTab('1')}
                            >
                                Primary Details
          </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => this.setActiveTab('2')}
                            >
                                Documents
          </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} className="mb-3">
                        <TabPane tabId="1">
                            <LoadingOverlay
                                active={this.state.loader}
                                spinner={<Spinner color="dark" />}
                                fadeSpeed={200}
                                classNamePrefix="mitiz"
                            >

                                <Row>
                                    <Col xl={6}>
                                        <FormGroup>
                                            <Label for="FirstName" className="mr-2">First Name :-</Label>
                                            {this.state.fields["FirstName"]
                                                ? this.state.fields["FirstName"]
                                                : ""}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="MI" className="mr-2">MI :-</Label>
                                            {
                                                this.state.fields["MI"]
                                                    ? this.state.fields["MI"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="LastName" className="mr-2">Last Name :-</Label>
                                            {
                                                this.state.fields["LastName"]
                                                    ? this.state.fields["LastName"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="Solution" className="mr-2">Solution :-</Label>
                                            {
                                                this.state.fields["Solution"]
                                                    ? this.state.fields["Solution"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="Address1" className="mr-2">Address1 :-</Label>
                                            {
                                                this.state.fields["Address1"]
                                                    ? this.state.fields["Address1"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="Address2" className="mr-2">Address2 :-</Label>
                                            {
                                                this.state.fields["Address2"]
                                                    ? this.state.fields["Address2"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="City" className="mr-2">City :-</Label>
                                            {
                                                this.state.fields["City"]
                                                    ? this.state.fields["City"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="State" className="mr-2">State :-</Label>
                                            {
                                                this.state.fields["State"]
                                                    ? this.state.fields["State"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="Address2" className="mr-2">Zipcode :-</Label>
                                            {
                                                this.state.fields["Zipcode"]
                                                    ? this.state.fields["Zipcode"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="HomePhone" className="mr-2">Home Phone :-</Label>
                                            {
                                                this.state.fields["HomePhone"]
                                                    ? this.state.fields["HomePhone"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="HomePhoneExt" className="mr-2">Home Phone Ext :-</Label>
                                            {
                                                this.state.fields["HomePhoneExt"]
                                                    ? this.state.fields["HomePhoneExt"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="WorkPhone" className="mr-2">Work Phone :-</Label>
                                            {
                                                this.state.fields["WorkPhone"]
                                                    ? this.state.fields["WorkPhone"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="WorkPhoneExt" className="mr-2">Work Phone Ext :-</Label>
                                            {
                                                this.state.fields["WorkPhoneExt"]
                                                    ? this.state.fields["WorkPhoneExt"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="Status" className="mr-2">Status :-</Label>
                                            {
                                                this.state.fields["Status"]
                                                    ? this.state.fields["Status"]
                                                    : ""
                                            }
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6}>
                                        <FormGroup>
                                            <Label for="Sex" className="mr-2">Sex :-</Label>
                                            {
                                                this.state.fields["Sex"]
                                                    ? this.state.fields["Sex"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="MaritalStatus" className="mr-2">Marital Status :-</Label>
                                            {
                                                this.state.fields["MaritalStatus"]
                                                    ? this.state.fields["MaritalStatus"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ResponsiblePartyStatus" className="mr-2">Responsible Party Status :-</Label>
                                            {
                                                this.state.fields["ResponsiblePartyStatus"]
                                                    ? this.state.fields["ResponsiblePartyStatus"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ResponsibleParty" className="mr-2">Responsible Party :-</Label>
                                            {
                                                this.state.fields["ResponsibleParty"]
                                                    ? this.state.fields["ResponsibleParty"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ResponsiblePartyName" className="mr-2">Responsible Party Name :-</Label>
                                            {
                                                this.state.fields["ResponsiblePartyName"]
                                                    ? this.state.fields["ResponsiblePartyName"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="BirthDate" className="mr-2">Birth Date :-</Label>
                                            {this.state.fields["BirthDate"]
                                                ? this.state.fields["BirthDate"]
                                                : ""}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="RecallFrequency" className="mr-2">Recall Frequency :-</Label>
                                            {
                                                this.state.fields["RecallFrequency"]
                                                    ? this.state.fields["RecallFrequency"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ReceiveRecallStatus" className="mr-2">Receive Recall Status :-</Label>
                                            {
                                                this.state.fields["ReceiveRecallStatus"]
                                                    ? this.state.fields["ReceiveRecallStatus"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="AccountBalance" className="mr-2">Account Balance :-</Label>
                                            {
                                                this.state.fields["AccountBalance"]
                                                    ? this.state.fields["AccountBalance"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="CurrentBal" className="mr-2">Current Bal :-</Label>
                                            {
                                                this.state.fields["CurrentBal"]
                                                    ? this.state.fields["CurrentBal"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ThirtyDay" className="mr-2">Thirty Day :-</Label>
                                            {
                                                this.state.fields["ThirtyDay"]
                                                    ? this.state.fields["ThirtyDay"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="SixtyDay" className="mr-2">Sixty Day :-</Label>
                                            {
                                                this.state.fields["SixtyDay"]
                                                    ? this.state.fields["SixtyDay"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="NinetyDay" className="mr-2">Ninety Day :-</Label>
                                            {
                                                this.state.fields["NinetyDay"]
                                                    ? this.state.fields["NinetyDay"]
                                                    : ""
                                            }
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="ContractBalance" className="mr-2">Contract Balance :-</Label>
                                            {
                                                this.state.fields["ContractBalance"]
                                                    ? this.state.fields["ContractBalance"]
                                                    : ""
                                            }
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </LoadingOverlay>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                {this.state.documents.length > 0 && this.state.documents.map(document =>
                                    <Col xl={2} key={`key-file-name-${document.file_name}`}>
                                        <Document document={document} updateDocument={this.updateDocument} enableDelete={false} showImage={this.showImage} />
                                    </Col>
                                )}
                            </Row>
                        </TabPane>
                    </TabContent>
                    <Row>
                        <Col xl={12} className="text-right">
                            <Button
                                type="button"
                                color="danger"
                                onClick={this.props.toggleModal}
                            >
                                Close
                                </Button>
                        </Col>
                    </Row>
                </ModalBody>
                {this.state.showModal && (
                    <ViewImage
                        showModal={this.state.showModal}
                        toggleSubModal={this.toggleSubModal}
                        imageSource={this.state.imageSource}
                    />
                )}
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        baseUrl: state.baseUrl
    };
};
export default connect(mapStateToProps)(ViewPatient);
