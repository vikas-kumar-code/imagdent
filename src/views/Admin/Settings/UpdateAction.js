import React, { Component } from "react";
import action from "../../../services/action";
import category from "../../../services/category";
import { connect } from "react-redux";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Form,
  FormText,
  CustomInput,
  Collapse,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader
} from "reactstrap";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactSummernote from "react-summernote";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.css";
import Timezone from "../../Front/Action/Timezone";
import LoadingOverlay from "react-loading-overlay";

class UpdateAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      fields: { shared_as: "Public", country: 254 },
      errors: {},
      submitted: false,
      description: "",
      countries: [],
      states: [],
      preview: "",
      start_on: new Date(),
      end_on: "",
      all_day: false,
      entire_country: false,
      issues: [],
      issueLoader: true,
      selected_issues: [],
      image: "",
      affiliations: []
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
    if (field === "country") {
      let selectedCountry = this.state.countries.filter(
        country => parseInt(country.id) === parseInt(e.target.value)
      );
      let states = selectedCountry[0].states;
      this.setState({ states });
    }
  };
  handleStartDate = date => {
    this.setState({
      start_on: date
    });
  };
  handleEndDate = date => {
    this.setState({
      end_on: date
    });
  };
  handleTextArea = description => {
    this.setState({ description });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      const params = {
        title: this.state.fields["title"],
        description: this.state.description,
        image: this.state.image,
        url: this.state.fields["url"],
        all_day: this.state.all_day,
        start_on: this.state.start_on,
        end_on: this.state.end_on,
        country: this.state.fields["country"],
        timezone: this.state.fields["timezone"],
        entire_country: this.state.entire_country,
        venue: this.state.fields["venue"],
        street_address: this.state.fields["street_address"],
        city: this.state.fields["city"],
        state: this.state.fields["state"],
        zip_code: this.state.fields["zip_code"],
        issues: this.state.selected_issues,
        time_to_complete: this.state.fields["time_to_complete"],
        shared_as: this.state.fields["shared_as"],
        id: this.props.actionId,
        group_id: this.state.fields["group_id"]
      };

      action.update(params).then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            toast.success(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleModal();
          } else if (response.data.error) {
            let errors = {};
            if (response.data.message.title) {
              errors["title"] = response.data.message.title[0];
            }
            this.setState({ errors: errors });
          }
        });
      });
    }
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["title"]) {
      formIsValid = false;
      errors["title"] = "Title can not be empty!";
    }

    if (this.state.all_day === false) {
      if (this.state.end_on === "") {
        formIsValid = false;
        errors["end_on"] = "Please choose end date for this action.";
      } else {
        let end_on = new Date(this.state.end_on);
        let start_on = new Date(this.state.start_on);
        if (end_on.getTime() < start_on.getTime()) {
          formIsValid = false;
          errors["end_on"] = "End date must be greater than start date.";
        }
      }
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  getAction = id => {
    this.setState({ loader: true });
    action.getOne({ id: id }).then(response => {
      if (response.data.success) {
        let fields = {
          title: response.data.action.title,
          venue: response.data.action.venue,
          state: response.data.action.state,
          city: response.data.action.city,
          street_address: response.data.action.street_address,
          country: response.data.action.country,
          zip_code: response.data.action.zip_code,
          shared_as: response.data.action.content.shared_as,
          time_to_complete: response.data.action.time_to_complete,
          issues: response.data.action.issues,
          url: response.data.action.url,
          group_id: response.data.action.group_id
        };
        this.getCountries();
        this.setState({
          loader: false,
          fields,
          start_on:
            response.data.action.start_on !== "0000-00-00 00:00:00"
              ? new Date(response.data.action.start_on)
              : "",
          end_on:
            response.data.action.end_on !== "0000-00-00 00:00:00"
              ? new Date(response.data.action.end_on)
              : "",
          description: response.data.action.description,
          preview: this.props.baseUrl + "/images/" + response.data.action.image
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  };

  getCountries = () => {
    action.getCountries().then(response => {
      if (response.data.success) {
        let states = response.data.countries.filter(
          country =>
            country.id === "254" || country.id === this.state.fields["country"]
        );
        this.setState({
          countries: response.data.countries,
          states: states[0].states
        });
      }
    });
  };

  componentDidMount = () => {
    if (this.props.actionId) {
      this.getAction(this.props.actionId);
    }
    this.getCountries();
    category
      .list("/category/list")
      .then(response => {
        if (response.data.success) {
          this.setState({
            issues: response.data.categories,
            issueLoader: false
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    action
      .groupAffiliations()
      .then(response => {
        if (response.data.success) {
          this.setState({
            affiliations: response.data.groups
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  chooseAllDay = () => {
    this.setState(prevState => {
      return {
        all_day: !prevState.all_day
      };
    });
  };
  chooseEntireCountry = () => {
    this.setState(prevState => {
      return {
        entire_country: !prevState.entire_country
      };
    });
  };
  handleIssue = e => {
    let selected_issues = this.state.selected_issues;
    if (e.target.checked) {
      selected_issues.push(e.target.id);
      this.setState({ selected_issues });
    } else {
      let index_to_be_removed = selected_issues.indexOf(e.target.id);
      selected_issues.splice(index_to_be_removed, 1);
      this.setState({ selected_issues });
    }
  };

  checkIssue = issue_id => {
    let issues = this.state.fields["issues"] ? this.state.fields["issues"] : [];
    if (issues.length > 0) {
      let findIssue = issues.filter(
        issue => parseInt(issue.issue_id) === parseInt(issue_id)
      );
      return findIssue.length > 0 ? true : false;
    }
    return false;
  };

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <ModalHeader toggle={this.props.toggleModal}>Update Action</ModalHeader>
        <ModalBody className="pl-4 pr-4">
          <div className="animated fadeIn">
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Form
                name="add-edit-action-form"
                method="post"
                onSubmit={this.handleSubmit}
              >
                <FormGroup>
                  <Label for="group">Group Affiliation</Label>
                  <Input
                    type="select"
                    bsSize="lg"
                    name="group_id"
                    id="group_id"
                    onChange={event => this.handleChange("group_id", event)}
                    value={
                      this.state.fields["group_id"]
                        ? this.state.fields["group_id"]
                        : ""
                    }
                    className="input-bg"
                  >
                    <option value="0">No Affiliation</option>
                    {this.state.affiliations.map(affiliation => (
                      <option
                        value={affiliation.id}
                        key={`key-affiliation-${affiliation.id}`}
                      >
                        {affiliation.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    bsSize="lg"
                    type="text"
                    name="title"
                    id="title"
                    value={
                      this.state.fields["title"]
                        ? this.state.fields["title"]
                        : ""
                    }
                    onChange={event => this.handleChange("title", event)}
                    invalid={this.state.errors["title"] ? true : false}
                    className="input-bg"
                  />
                  {this.state.errors["title"] && (
                    <FormFeedback>{this.state.errors["title"]}</FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="description">Brief Description</Label>
                  <ReactSummernote
                    options={{
                      height: 150,
                      dialogsInBody: true,
                      toolbar: [
                        ["style", ["style"]],
                        ["font", ["bold", "underline", "clear"]],
                        ["fontname", ["fontname"]],
                        ["para", ["ul", "ol", "paragraph"]],
                        ["table", ["table"]],
                        /* ["insert", ["link", "picture", "video"]], */
                        ["view", ["fullscreen", "codeview"]]
                      ]
                    }}
                    value={this.state.description}
                    onChange={this.handleTextArea}
                  />
                </FormGroup>
                <FormGroup>
                  <Row className="justify-content-between align-items-end">
                    <Col md={3}>
                      {this.state.preview !== "" ? (
                        <img src={this.state.preview} />
                      ) : (
                        <img
                          src={require("../../../assets/images/no-image.png")}
                          className="rounded post-image"
                        />
                      )}
                    </Col>
                    <Col md={9}>
                      <FilePond
                        className="mb-0"
                        allowMultiple={false}
                        allowRemove={true}
                        ref={ref => (this.pond = ref)}
                        server={{
                          url: this.props.apiUrl,
                          process: {
                            url: "/action/upload",
                            headers: {
                              "X-Api-Key": `Bearer  ${this.props.token}`
                            },
                            onload: response => {
                              let response_josn = JSON.parse(response);
                              if (response_josn.success) {
                                this.setState({
                                  image: response_josn.file_name,
                                  preview:
                                    this.props.baseUrl +
                                    "/images/temp/" +
                                    response_josn.file_name
                                });
                                return response_josn.file_name;
                              }
                            }
                          },
                          revert: {
                            url: "/content/delete-image",
                            headers: {
                              "X-Api-Key": `Bearer  ${this.props.token}`
                              //file_name: files
                            },
                            onload: response => {
                              //console.log(response);
                            }
                          }
                        }}
                        onprocessfilerevert={file => {
                          this.setState({
                            icon: "",
                            preview: ""
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Label for="question">Action URL</Label>
                  <Input
                    type="url"
                    name="url"
                    id="url"
                    value={
                      this.state.fields["url"] ? this.state.fields["url"] : ""
                    }
                    onChange={event => this.handleChange("url", event)}
                    invalid={this.state.errors["url"] ? true : false}
                    className="input-bg"
                    bsSize="lg"
                  />
                  <FormText>
                    URL of the page that provides additional information about
                    this action
                  </FormText>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="all_day">
                    When is this action taking place?
                  </Label>
                  <CustomInput
                    type="checkbox"
                    id="all_day"
                    label="All day"
                    onChange={this.chooseAllDay}
                  />
                </FormGroup>
                <Collapse isOpen={!this.state.all_day}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="close_on">Start date</Label>
                        <DatePicker
                          className="form-control input-bg form-control-lg"
                          minDate={new Date()}
                          style={{ width: 100 + "%", float: "left" }}
                          selected={this.state.start_on}
                          onChange={this.handleStartDate}
                          dateFormat="yyyy-MM-dd HH:mm"
                          timeFormat="HH:mm"
                          showTimeSelect
                        />

                        <FormFeedback
                          style={{
                            display: this.state.errors["start_on"]
                              ? "block"
                              : "none"
                          }}
                        >
                          {this.state.errors["start_on"]}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="close_on">End date</Label>
                        <DatePicker
                          className="form-control input-bg form-control-lg"
                          minDate={new Date()}
                          style={{ width: 100 + "%", float: "left" }}
                          selected={this.state.end_on}
                          onChange={this.handleEndDate}
                          dateFormat="yyyy-MM-dd HH:mm"
                          timeFormat="HH:mm"
                          showTimeSelect
                        />

                        <FormFeedback
                          style={{
                            display: this.state.errors["end_on"]
                              ? "block"
                              : "none"
                          }}
                        >
                          {this.state.errors["end_on"]}
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                  </Row>
                </Collapse>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="country">Country</Label>
                      <Input
                        bsSize="lg"
                        type="select"
                        name="country"
                        id="country"
                        value={
                          this.state.fields["country"]
                            ? this.state.fields["country"]
                            : ""
                        }
                        onChange={event => this.handleChange("country", event)}
                        invalid={this.state.errors["country"] ? true : false}
                        className="input-bg"
                      >
                        <option>-Select-</option>
                        {this.state.countries.map(country => (
                          <option
                            value={country.id}
                            key={`country-1-${country.id}`}
                          >
                            {country.name}
                          </option>
                        ))}
                      </Input>
                      {this.state.errors["country"] && (
                        <FormFeedback>
                          {this.state.errors["country"]}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="timezone">Timezone</Label>
                      <Timezone
                        fields={this.state.fields}
                        errors={this.state.errors}
                        handleChange={this.handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="location">Location</Label>
                  <CustomInput
                    type="checkbox"
                    id="location"
                    label="Virtual / Entire Country"
                    onChange={this.chooseEntireCountry}
                  />
                </FormGroup>
                <Collapse isOpen={!this.state.entire_country}>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="close_on">Venue</Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="venue"
                          id="title"
                          value={
                            this.state.fields["venue"]
                              ? this.state.fields["venue"]
                              : ""
                          }
                          onChange={event => this.handleChange("venue", event)}
                          invalid={this.state.errors["venue"] ? true : false}
                          className="input-bg"
                        />
                        {this.state.errors["venue"] && (
                          <FormFeedback>
                            {this.state.errors["venue"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="close_on">Street Address</Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="street_address"
                          id="street_address"
                          value={
                            this.state.fields["street_address"]
                              ? this.state.fields["street_address"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("street_address", event)
                          }
                          invalid={
                            this.state.errors["street_address"] ? true : false
                          }
                          className="input-bg"
                        />
                        {this.state.errors["street_address"] && (
                          <FormFeedback>
                            {this.state.errors["street_address"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="close_on">City</Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="city"
                          id="city"
                          value={
                            this.state.fields["city"]
                              ? this.state.fields["city"]
                              : ""
                          }
                          onChange={event => this.handleChange("city", event)}
                          invalid={this.state.errors["city"] ? true : false}
                          className="input-bg"
                        />
                        {this.state.errors["city"] && (
                          <FormFeedback>
                            {this.state.errors["city"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="close_on">State/Region</Label>
                        <Input
                          bsSize="lg"
                          type="select"
                          name="state"
                          id="state"
                          value={
                            this.state.fields["state"]
                              ? this.state.fields["state"]
                              : ""
                          }
                          onChange={event => this.handleChange("state", event)}
                          invalid={this.state.errors["state"] ? true : false}
                          className="input-bg"
                        >
                          <option value="">-Select-</option>
                          {this.state.states.map(state => (
                            <option
                              value={state.state_id}
                              key={`state-${state.state_id}`}
                            >
                              {state.state}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="close_on">ZIP/Postal Code</Label>
                        <Input
                          bsSize="lg"
                          type="text"
                          name="zip_code"
                          id="zip_code"
                          value={
                            this.state.fields["zip_code"]
                              ? this.state.fields["zip_code"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("zip_code", event)
                          }
                          invalid={this.state.errors["zip_code"] ? true : false}
                          className="input-bg"
                        />
                        {this.state.errors["zip_code"] && (
                          <FormFeedback>
                            {this.state.errors["zip_code"]}
                          </FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup>
                        <Label for="close_on">Country</Label>
                        <Input
                          bsSize="lg"
                          type="select"
                          name="country"
                          id="country"
                          value={
                            this.state.fields["country"]
                              ? this.state.fields["country"]
                              : ""
                          }
                          onChange={event =>
                            this.handleChange("country", event)
                          }
                          invalid={this.state.errors["country"] ? true : false}
                          className="input-bg"
                        >
                          <option value="">-Select-</option>
                          {this.state.countries.map(country => (
                            <option
                              value={country.id}
                              key={`country-2-${country.id}`}
                            >
                              {country.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={12} className="mb-2" style={{ fontSize: 13 }}>
                      If this action does not have a specific location, but is
                      local or regional, please provide the state and/or postal
                      code
                    </Col>
                  </Row>
                </Collapse>
                <FormGroup>
                  <strong>Issue Area(s)</strong>
                  <CustomInput
                    type="checkbox"
                    id="select_all"
                    label="Select All"
                    onChange={this.chooseIssue}
                    className="mb-3"
                  />
                  <FormGroup className="mb-1">
                    <CustomInput
                      type="checkbox"
                      id={0}
                      label="Uncategorized"
                      onChange={this.chooseIssue}
                    />
                  </FormGroup>
                  {this.state.issueLoader ? (
                    <React.Fragment>
                      <div>
                        <Spinner size="sm" color="dark" /> Please wait..
                      </div>
                    </React.Fragment>
                  ) : (
                    this.state.issues.map(issue => (
                      <FormGroup key={`key-${issue.id}`} className="mb-1">
                        {this.checkIssue(issue.id) ? (
                          <CustomInput
                            type="checkbox"
                            id={issue.id}
                            label={issue.name}
                            onChange={this.handleIssue}
                            checked={true}
                          />
                        ) : (
                          <CustomInput
                            type="checkbox"
                            id={issue.id}
                            label={issue.name}
                            onChange={this.handleIssue}
                          />
                        )}
                      </FormGroup>
                    ))
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="close_on">Approximate time to complete</Label>
                  <Input
                    bsSize="lg"
                    type="number"
                    min="1"
                    name="time_to_complete"
                    id="time_to_complete"
                    value={
                      this.state.fields["time_to_complete"]
                        ? this.state.fields["time_to_complete"]
                        : ""
                    }
                    onChange={event =>
                      this.handleChange("time_to_complete", event)
                    }
                    invalid={
                      this.state.errors["time_to_complete"] ? true : false
                    }
                    className="input-bg"
                  />
                  {this.state.errors["time_to_complete"] && (
                    <FormFeedback>
                      {this.state.errors["time_to_complete"]}
                    </FormFeedback>
                  )}
                  <FormText>
                    How long will it take to complete this action (in minutes)
                  </FormText>
                </FormGroup>
                <FormGroup>
                  <Label for="shared_as">Visibility</Label>
                  <Input
                    style={{ width: 200 }}
                    type="select"
                    bsSize="lg"
                    name="shared_as"
                    id="shared_as"
                    onChange={event => this.handleChange("shared_as", event)}
                    value={
                      this.state.fields["shared_as"]
                        ? this.state.fields["shared_as"]
                        : ""
                    }
                    className="input-bg"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Friends">Friends</option>
                  </Input>
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
                      {this.state.id === "" ? "Create" : "Update"}
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
    baseUrl: state.baseUrl
  };
};
export default connect(mapStateToProps)(UpdateAction);
