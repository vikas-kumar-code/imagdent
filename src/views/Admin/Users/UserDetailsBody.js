import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
    Col,
    Row,
    Spinner,
    Label,
    FormGroup,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Card,
    CardHeader,
    CardBody,
    Button
} from "reactstrap";
import classnames from "classnames";
import common from "../../../services/common";
import user from "../../../services/user";
import clinic from "../../../services/clinic";
import Documents from "../Documents/Documents";
import location from "../../../services/location";
import Notes from "../Notes/";

class UserDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            error_403: false,
            loader: true,
            activeTab: "1",
            documents: [],
            locations: [],
            imageSource: "",
            documents: [],
            documentTypes: common.getDocumentTypes()[0],
            roles: [],
            clinics: [],
            notes: []
        };
    }

    setActiveTab = activeTab => {
        if (activeTab !== this.state.activeTab) {
            this.setState({ activeTab });
        }
    };
    getUser = id => {
        this.setState({ loader: true });
        user.getOne({ id: id }).then(response => {
            if (response.data.success) {
                let fields = response.data.user;
                let documents = response.data.user.documents;
                let notes = response.data.user.notes;
                fields["country"] =
                    fields.pcountry != null ? fields.pcountry.name : "N/A";
                fields["state"] = fields.pstate != null ? fields.pstate.state : "N/A";
                fields["b_country"] =
                    fields.bcountry != null ? fields.bcountry.name : "N/A";
                fields["b_state"] = fields.bstate != null ? fields.bstate.state : "N/A";
                fields["m_country"] =
                    fields.mcountry != null ? fields.mcountry.name : "N/A";
                fields["m_state"] = fields.mstate != null ? fields.mstate.state : "N/A";
                fields["l_country"] =
                    fields.lcountry != null ? fields.lcountry.name : "N/A";
                fields["l_state"] = fields.lstate != null ? fields.lstate.state : "N/A";
                this.setState({
                    loader: false,
                    fields,
                    documents,
                    notes
                });
            } else if (response.data.error) {
                this.setState({
                    error_403: true
                });
            }
        });
    };
    componentDidMount() {
        location.list().then(response => {
            if (response.data.success) {
                this.setState({ locations: response.data.locations });
            }
        });
        common
            .getRoles()
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        roles: response.data.roles
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        clinic
            .list()
            .then(response => {
                if (response.data.success) {
                    this.setState({
                        clinics: response.data.clinics
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        if (this.props.id) {
            this.getUser(this.props.id);
        }
    }
    showImage = e => {
        this.setState({ imageSource: e.target.src });
    };

    render() {
        const { fields } = this.state;
        return (
            <>
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <Row>
                                    <Col md={8} sm={12}>
                                        <strong style={{ fontSize: 20 }}>
                                            {fields["username"]
                                                ? `${fields["username"]}'s Details`
                                                : ""}
                                        </strong>
                                    </Col>
                                    {this.props.enableEditDoctor && (
                                        <Col md={4} sm={12} className="text-right">
                                            <Row>
                                                <Col sm={12} md={6}>
                                                    <Link to={`/admin/users`} className="btn btn-danger m-1 btn-block">
                                                        <FontAwesomeIcon icon="undo" className="mr-2" />
                                                        Back
                                                    </Link>
                                                </Col>
                                                <Col sm={12} md={6}>
                                                    <Link
                                                        to={`/admin/users/edit/${fields["id"]}`}
                                                        className="btn btn-primary m-1 btn-block"
                                                    >
                                                        Edit User
                                                    </Link>
                                                </Col>
                                            </Row>
                                        </Col>
                                    )}
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: this.state.activeTab === "1"
                                            })}
                                            onClick={() => this.setActiveTab("1")}
                                            style={{ fontSize: 20 }}
                                        >
                                            Basic Details
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: this.state.activeTab === "2"
                                            })}
                                            onClick={() => this.setActiveTab("2")}
                                            style={{ fontSize: 20 }}
                                        >
                                            Documents
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active: this.state.activeTab === "3"
                                            })}
                                            onClick={() => this.setActiveTab("3")}
                                            style={{ fontSize: 20 }}
                                        >
                                            Notes
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
                                                        <Label for="name" className="mr-2">
                                                            <strong>Name :-</strong>
                                                        </Label>
                                                        {fields["first_name"] ? common.getFullName(fields) : ""}
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="email" className="mr-2">
                                                            <strong>Email :-</strong>
                                                        </Label>
                                                        <a href={`mailto:${fields["email"]}`}>
                                                            {fields["email"] ? fields["email"] : "N/A"}
                                                        </a>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Phone :-</strong>
                                                            </Label>
                                                            {fields["phone"] ? fields["phone"] : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Fax :-</strong>
                                                            </Label>
                                                            {fields["fax"] ? fields["fax"] : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>
                                                            <strong>Cell Phone :-</strong>
                                                        </Label>
                                                        {fields["mobile"] ? fields["mobile"] : "N/A"}
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <Label for="contact_name">
                                                            <strong>Username :-</strong>
                                                        </Label>
                                                        {fields["username"] ? fields["username"] : "N/A"}
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label>
                                                            <strong>Clinic :-</strong>
                                                        </Label>
                                                        {(fields["clinicDetails"] && fields["clinicDetails"].length > 0)
                                                            ? fields["clinicDetails"]
                                                                .map(c => c.name)
                                                                .join(", ")
                                                            : "N/A"}
                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Label for="locations">
                                                            <strong>Location :-</strong>
                                                        </Label>
                                                        {fields["locations"]
                                                            ? this.state.locations
                                                                .filter(v =>
                                                                    fields["locations"]
                                                                        .split(",")
                                                                        .includes(v.id)
                                                                )
                                                                .map(l => l.publish_name)
                                                                .join(", ")
                                                            : "N/A"}
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label for="role_id">
                                                                <strong>Role :-</strong>
                                                            </Label>
                                                            {fields["role_id"]
                                                                ? this.state.roles
                                                                    .filter(v => v.id == fields["role_id"])
                                                                    .map(v => v.name)
                                                                : "N/A"}
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>NPI :-</strong>
                                                            </Label>
                                                            {fields["npi"] && fields["npi"] != 0
                                                                ? fields["npi"]
                                                                : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>InivisAlign ID :-</strong>
                                                            </Label>
                                                            {fields["invisalignId"] &&
                                                                fields["invisalignId"] != 0
                                                                ? fields["invisalignId"]
                                                                : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Status :-</strong>
                                                            </Label>
                                                            {fields["status"] === "Y" ? "Active" : "Inactive"}
                                                        </Col>
                                                    </FormGroup>
                                                    <h5>Licence Details</h5>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Country :-</strong>
                                                            </Label>
                                                            {fields["l_country"] && fields["l_country"]}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label for="state">
                                                                <strong>State :-</strong>
                                                            </Label>
                                                            {fields["l_state"] && fields["l_state"]}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Licence No :-</strong>
                                                            </Label>
                                                            {fields["licence_no"] && fields["licence_no"]}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Status :-</strong>
                                                            </Label>
                                                            {fields["l_status"] === "Y"
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                                <Col xl={6}>
                                                    <h5>Physical Address</h5>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Street Address :-</strong>
                                                            </Label>
                                                            {fields["p_street"] ? fields["p_street"] : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Building :-</strong>
                                                            </Label>
                                                            {fields["p_address2"]
                                                                ? fields["p_address2"]
                                                                : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label for="country">
                                                                <strong>Country :-</strong>
                                                            </Label>{" "}
                                                            {fields["country"] && fields["country"]}
                                                        </Col>
                                                        <Col sm={6}>
                                                            {" "}
                                                            <Label for="state">
                                                                <strong>State :-</strong>
                                                            </Label>{" "}
                                                            {fields["state"] && fields["state"]}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>City :-</strong>
                                                            </Label>
                                                            {fields["city"] ? fields["city"] : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label for="p_zipcode">
                                                                <strong>Zipcode :-</strong>
                                                            </Label>
                                                            {fields["p_zipcode"] && fields["p_zipcode"] != 0
                                                                ? fields["p_zipcode"]
                                                                : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                    <h5>Billing Address</h5>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Street Address :-</strong>
                                                            </Label>
                                                            {fields["b_street"] ? fields["b_street"] : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Building :-</strong>
                                                            </Label>
                                                            {fields["b_address2"]
                                                                ? fields["b_address2"]
                                                                : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label for="b_country">
                                                                <strong>Country :-</strong>
                                                            </Label>
                                                            {fields["b_country"] && fields["b_country"]}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label for="b_state">
                                                                <strong>State :-</strong>
                                                            </Label>
                                                            {fields["b_state"] && fields["b_state"]}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>City :-</strong>
                                                            </Label>
                                                            {fields["b_city"] ? fields["b_city"] : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label for="b_zipcode">
                                                                <strong>Zipcode :-</strong>
                                                            </Label>
                                                            {fields["b_zipcode"] && fields["b_zipcode"] != 0
                                                                ? fields["b_zipcode"]
                                                                : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                    <h5>Mailing Address</h5>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Street Address :-</strong>
                                                            </Label>
                                                            {fields["m_street"] ? fields["m_street"] : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>Building :-</strong>
                                                            </Label>
                                                            {fields["m_address2"]
                                                                ? fields["m_address2"]
                                                                : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label for="m_country">
                                                                <strong>Country :-</strong>
                                                            </Label>
                                                            {fields["m_country"] && fields["m_country"]}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label for="m_state">
                                                                <strong>State :-</strong>
                                                            </Label>
                                                            {fields["m_state"] && fields["m_state"]}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup row>
                                                        <Col sm={6}>
                                                            <Label>
                                                                <strong>City :-</strong>
                                                            </Label>
                                                            {fields["m_city"] ? fields["m_city"] : "N/A"}
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Label for="m_zipcode">
                                                                <strong>Zipcode :-</strong>
                                                            </Label>
                                                            {fields["m_zipcode"] && fields["m_zipcode"] != 0
                                                                ? fields["m_zipcode"]
                                                                : "N/A"}
                                                        </Col>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </LoadingOverlay>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Documents
                                            documents={this.state.documents}
                                            documentTypes={this.state.documentTypes}
                                            enableDelete={false}
                                            enableEdit={false}
                                            //removeDocument={this.removeDocument}
                                            uploadedOn={true}
                                            title="Uploaded Documents"
                                            chooseDocument={false}
                                        />
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <Notes
                                            notes={this.state.notes}
                                            enableDelete={false}
                                            enableEdit={false}
                                            removeNote={this.removeNote}
                                            fillNote={this.fillNote}
                                            addedOn={true}
                                            addedBy={false}
                                            title="All Notes"
                                        />
                                    </TabPane>
                                </TabContent>
                                {this.props.enableEditDoctor && (
                                    <Row>
                                        <Col xl={12} className="text-right">
                                            <Link to={`/admin/users`} className="btn btn-danger">
                                                <FontAwesomeIcon icon="undo" className="mr-2" />
                                                Back
                                            </Link>
                                            <Link
                                                to={`/admin/users/edit/${fields["id"]}`}
                                                className="btn btn-primary  ml-1"
                                            >
                                                Edit User
                                            </Link>
                                        </Col>
                                    </Row>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

export default UserDetails;
