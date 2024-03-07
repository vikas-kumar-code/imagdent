import React, { Component, Fragment } from "react";
import user from "../../../services/user";
import common from "../../../services/common";
import clinic from "../../../services/clinic";
import location from "../../../services/location";
import { connect } from "react-redux";
import { changeLocation } from "../../../store/actions";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  Spinner,
  FormFeedback,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import NumberFormat from "react-number-format";
import classnames from "classnames";
import { Link } from "react-router-dom";
import Documents from "../Documents/Documents";
import AddEditDocument from "../Documents/AddEditDocument";
import Notes from "../Notes/";
import AddEditNote from "../Notes/AddEditNote";
class AddEditUser extends Component {
  constructor(props) {
    super(props);
    this.searchTimeOut = 0;
    this.state = {
      roles: [],
      loader: true,
      fields: { status: "Y" },
      oldFields: {},
      errors: {},
      submitted: false,
      //docSubmitted: false,
      locations: [],
      activeTab: "1",
      documentTypes: common.getDocumentTypes()[0],
      documents: [],
      enableEditButton: false,
      enableDeleteButton: true,
      pCountries: [],
      pStates: [],
      bCountries: [],
      bStates: [],
      mCountries: [],
      mStates: [],
      lCountries: [],
      lStates: [],
      clinics: [],
      checked1: false,
      checked2: false,
      checked3: false,
      notes: [],
      noteFields: {},
      noteIndex: "",
      checkUploadedFile: false,
      checkNotesAdded: false,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({ loader: false });
      this.getUser(this.props.match.params.id, () => {
        this.setState({ loader: false });
      });
    }
  };

  checkNotesAdded = (val) => {
    this.setState({ checkNotesAdded: val });
  };

  checkUploadedFile = (val) => {
    this.setState({ checkUploadedFile: val });
  };

  handleChange = (e) => {
    let fields = this.state.fields;
    let { name, value } = e.target;
    /*if (name.includes("b_")) {
      this.state.checked1 && this.setState({ checked1: false });
    }
    if (name.includes("m_")) {
      this.state.checked2 && this.setState({ checked2: false });
      this.state.checked3 && this.setState({ checked3: false });
    }*/
    fields[name] = value;
    this.setState({ fields });
  };

  handleMultiChange = (field, option) => {
    let fields = this.state.fields;
    fields[field] = option;
    this.setState({ fields });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      if (parseInt(this.props.userType) !== 15) {
        if (this.state.activeTab === "1") {
          this.setActiveTab("2");
        } else if (this.state.activeTab === "2") {
          if (this.state.checkUploadedFile) {
            alert("Save the document or cancel to discard");
          } else {
            this.setActiveTab("3");
          }
        } else if (this.state.activeTab === "3")
          if (this.state.checkNotesAdded) {
            alert("Save the note or cancel to discard");
          } else {
            this.setState({ submitted: true });
            const params = {
              fields: this.state.fields,
              documents: this.state.documents,
              notes: this.state.notes,
            };
            let that = this;
            user
              .add(params)
              .then((response) => {
                this.setState({ submitted: false }, () => {
                  if (response.data.success) {
                    toast.success(response.data.message, {
                      position: toast.POSITION.TOP_RIGHT,
                    });
                    if (parseInt(this.props.userType) === 1) {
                      this.props.history.push("/admin/users");
                    } else {
                      this.props.history.push("admin/dashboard");
                    }
                  } else if (response.data.error) {
                    if (response.data.message) {
                      this.setState({ errors: response.data.message });
                      this.setActiveTab("1");
                    }
                  }
                });
              })
              .catch(function (error) {
                that.setState({ submitted: false });
              });
          }
      } else {
        this.setState({ submitted: true });
        const params = {
          fields: this.state.fields,
          documents: this.state.documents,
          notes: this.state.notes,
        };
        let that = this;
        user
          .add(params)
          .then((response) => {
            this.setState({ submitted: false }, () => {
              if (response.data.success) {
                toast.success(response.data.message, {
                  position: toast.POSITION.TOP_RIGHT,
                });
                if (parseInt(this.props.userType) === 1) {
                  this.props.history.push("/admin/users");
                } else {
                  this.props.history.push("admin/dashboard");
                  if (this.props.userType == 15) {
                    this.props.changeLocation({
                      defaultLocation: this.state.fields.default_location.value,
                    });
                  }
                }
              } else if (response.data.error) {
                if (response.data.message) {
                  this.setState({ errors: response.data.message });
                  this.setActiveTab("1");
                }
              }
            });
          })
          .catch(function (error) {
            that.setState({ submitted: false });
          });
      }
    } else {
      this.setActiveTab("1");
    }
  };

  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Email can not be empty!";
    }
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Username can not be empty!";
    }

    if (!fields["role_id"]) {
      formIsValid = false;
      errors["role_id"] = "Please select role.";
    }
    if (!fields["default_location"]) {
      formIsValid = false;
      errors["default_location"] = "Please select any default location";
    }
    if (!fields["locations"]) {
      formIsValid = false;
      errors["locations"] = "Please select atleast one location";
    }

    this.setState({ errors: errors });
    return formIsValid;
  };

  getUser = (id) => {
    let pStates = [];
    let bStates = [];
    let mStates = [];
    let lStates = [];
    user.getOne({ id: id }).then((response) => {
      if (response.data.success) {
        let fields = Object.assign({}, response.data.user);
        let documents = response.data.user.documents;
        let notes = response.data.user.notes;

        if (response.data.user.clinics !== null) {
          fields["clinics"] = response.data.user.clinicDetails
            .map((v, i) => ({ label: v.name, value: v.id }));
        }

        if (response.data.user.locations !== null) {
          fields["locations"] = this.state.locations
            .filter((loc) => response.data.user.locations.includes(loc.value))
            .map((v, i) => ({ label: v.label, value: v.value }));
        }

        if (response.data.user.default_location !== null) {
          this.state.locations.map((loc) => {
            if (response.data.user["default_location"] == loc.value) {
              fields["default_location"] = {
                label: loc.label,
                value: loc.value,
              };
            }
          });
        }

        if (response.data.user.country_id !== null) {
          fields["country_id"] = {
            label: response.data.user.pcountry.name,
            value: response.data.user.pcountry.id,
          };
          if (response.data.user.state_id !== null) {
            fields["state_id"] = {
              label: response.data.user.pstate.state,
              value: response.data.user.pstate.state_id,
            };
          }

          this.state.pCountries.forEach((country) => {
            if (country.value === response.data.user.country_id) {
              typeof country.states !== "undefined" &&
                country.states.forEach((state, index) => {
                  pStates[index] = {
                    value: state.state_id,
                    label: state.state,
                  };
                });
            }
          });
        }else{
          this.state.pCountries[0].states.forEach((state, index) => {
            pStates[index] = {
              value: state.state_id,
              label: state.state,
            };
          });
        }

        if (response.data.user.bcountry_id !== null) {
          fields["bcountry_id"] = {
            label: response.data.user.bcountry.name,
            value: response.data.user.bcountry.id,
          };
          if (response.data.user.bstate_id !== null) {
            fields["bstate_id"] = {
              label: response.data.user.bstate.state,
              value: response.data.user.bstate.state_id,
            };
          }
          this.state.bCountries.forEach((country) => {
            if (country.value === response.data.user.bcountry_id) {
              typeof country.states !== "undefined" &&
                country.states.forEach((state, index) => {
                  bStates[index] = {
                    value: state.state_id,
                    label: state.state,
                  };
                });
            }
          });
        }else{
          this.state.bCountries[0].states.forEach((state, index) => {
            bStates[index] = {
              value: state.state_id,
              label: state.state,
            };
          });
        }
        if (response.data.user.mcountry_id !== null) {
          fields["mcountry_id"] = {
            label: response.data.user.mcountry.name,
            value: response.data.user.mcountry.id,
          };
          if (response.data.user.mstate_id !== null) {
            fields["mstate_id"] = {
              label: response.data.user.mstate.state,
              value: response.data.user.mstate.state_id,
            };
          }
          this.state.mCountries.forEach((country) => {
            if (country.value === response.data.user.mcountry_id) {
              typeof country.states !== "undefined" &&
                country.states.forEach((state, index) => {
                  mStates[index] = {
                    value: state.state_id,
                    label: state.state,
                  };
                });
            }
          });
        }else{
          this.state.mCountries[0].states.forEach((state, index) => {
            mStates[index] = {
              value: state.state_id,
              label: state.state,
            };
          });
        }

          if (response.data.user.lcountry_id !== null) {
            fields["lcountry_id"] = {
              label: response.data.user.lcountry.name,
              value: response.data.user.lcountry.id,
            };
            if (response.data.user.lstate_id !== null) {
              fields["lstate_id"] = {
                label: response.data.user.lstate.state,
                value: response.data.user.lstate.state_id,
              };
            }
            this.state.lCountries.forEach((country) => {
              if (country.value === response.data.user.lcountry_id) {
                typeof country.states !== "undefined" &&
                  country.states.forEach((state, index) => {
                    lStates[index] = {
                      value: state.state_id,
                      label: state.state,
                    };
                  });
              }
            });
          }else{
            this.state.lCountries[0].states.forEach((state, index) => {
              lStates[index] = {
                value: state.state_id,
                label: state.state,
              };
            });
          }
        
        this.setState({
          loader: false,
          fields,
          oldFields: fields,
          documents,
          notes,
          mStates,
          bStates,
          pStates,
          lStates,
        });
      } else if (response.data.error) {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  componentDidMount = () => {
    location.list().then((response) => {
      let locations = [];
      let fields = this.state.fields;
      if (response.data.success) {
        response.data.locations.forEach((loc, index) => {
          locations[index] = {
            label: loc.publish_name,
            value: loc.id,
          };
        });
        fields["locations"] = locations.map((v, i) => ({
          label: v.label,
          value: v.value,
        }));

        this.setState(
          {
            locations,
            fields,
          },
          () => {
            common
              .getRoles()
              .then((response) => {
                if (response.data.success) {
                  this.setState(
                    {
                      roles: response.data.roles,
                    },
                    () => {
                      common
                        .getCountries()
                        .then((response) => {
                          let fields = this.state.fields;
                          let pCountries = [];
                          let states = [];
                          if (response.data.success) {
                            response.data.countries.forEach(
                              (country, index) => {
                                pCountries[index] = {
                                  label: country.name,
                                  value: country.id,
                                  states: country.states,
                                };
                              }
                            );
                            response.data.countries[0].states.forEach(
                              (state, index) => {
                                states[index] = {
                                  label: state.state,
                                  value: state.state_id,
                                };
                              }
                            );

                            fields["lcountry_id"] = {
                              label: "United States",
                              value: "254",
                            };
                            fields["mcountry_id"] = {
                              label: "United States",
                              value: "254",
                            };
                            fields["pcountry_id"] = {
                              label: "United States",
                              value: "254",
                            };
                            fields["country_id"] = {
                              label: "United States",
                              value: "254",
                            };
                            this.setState(
                              {
                                fields,
                                pStates: states,
                                lStates: states,
                                mStates: states,
                                bStates: states,
                                states: states,
                                pCountries,
                                mCountries: pCountries,
                                bCountries: pCountries,
                                lCountries: pCountries,
                              },
                              () => {
                                if (this.props.match.params.id) {
                                  this.getUser(this.props.match.params.id);
                                } else {
                                  this.setState({ loader: false });
                                }
                              }
                            );
                          }
                        })
                        .catch(function (error) {
                          console.log(error);
                        });
                    }
                  );
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        );
      }
    });
  };
  setActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };
  addDocument = (file) => {
    let documents = [...this.state.documents, file];
    this.setState({ documents });
  };
  addNote = (note, indx) => {
    let notes = this.state.notes;
    if (indx !== undefined) {
      notes.forEach((n, index) => {
        if (parseInt(index) === parseInt(indx)) {
          notes[index].note_type = note.note_type;
          notes[index].notes = note.notes;
        }
      });
      this.setState({ notes, noteIndex: "", noteFields: {} });
    } else {
      notes = [...notes, note];
      this.setState({ notes });
    }
  };
  removeDocument = (file_name) => {
    let documents = this.state.documents.filter(
      (document) => document.document_name !== file_name
    );
    this.setState({ documents });
  };

  removeNote = (e) => {
    if (window.confirm("Are you sure to delete this note?")) {
      let notes = this.state.notes.filter(
        (note, index) => parseInt(index) !== parseInt(e.target.dataset.index)
      );
      this.setState({ notes });
    }
  };

  fillNote = (e) => {
    let notes = this.state.notes.filter(
      (note, index) => parseInt(index) === parseInt(e.target.dataset.index)
    );
    this.setState({ noteFields: notes[0], noteIndex: e.target.dataset.index });
  };
  handleReset = () => {
    this.setState({
      noteIndex: "",
      noteFields: {},
    });
  };
  handlePcountryChange = (country) => {
    let fields = this.state.fields;
    fields["country_id"] = country;
    let pStates = [];
    typeof country.states !== "undefined" &&
      country.states.forEach((state, index) => {
        pStates[index] = { value: state.state_id, label: state.state };
      });
    if (pStates && pStates.length > 0) {
      fields["state_id"] = { value: "", label: "Select State..." };
    }
    this.setState({ fields, pStates });
  };
  handleBcountryChange = (country) => {
    let fields = this.state.fields;
    fields["bcountry_id"] = country;
    let bStates = [];
    typeof country.states !== "undefined" &&
      country.states.forEach((state, index) => {
        bStates[index] = { value: state.state_id, label: state.state };
      });
    if (bStates && bStates.length > 0) {
      fields["bstate_id"] = { value: "", label: "Select State..." };
    }
    this.setState({ fields, bStates });
  };
  handleMcountryChange = (country) => {
    let fields = this.state.fields;
    fields["mcountry_id"] = country;
    let mStates = [];
    typeof country.states !== "undefined" &&
      country.states.forEach((state, index) => {
        mStates[index] = { value: state.state_id, label: state.state };
      });
    if (mStates && mStates.length > 0) {
      fields["mstate_id"] = { value: "", label: "Select State..." };
    }
    this.setState({ fields, mStates });
  };
  handleLcountryChange = (country) => {
    let fields = this.state.fields;
    fields["lcountry_id"] = country;
    let lStates = [];
    typeof country.states !== "undefined" &&
      country.states.forEach((state, index) => {
        lStates[index] = { value: state.state_id, label: state.state };
      });
    if (lStates && lStates.length > 0) {
      fields["lstate_id"] = { value: "", label: "Select State..." };
    }
    this.setState({ fields, lStates });
  };
  handleStateChange = (field, e) => {
    let fields = this.state.fields;
    fields[field] = { label: e.label, value: e.value };
    this.setState({ fields });
  };
  setAddress = (field, e) => {
    this.setState({ [e.target.name]: e.target.checked }, () => {
      let fields = Object.assign({}, this.state.fields);
      let oldFields = Object.assign({}, this.state.oldFields);
      let { checked1, checked2, checked3 } = this.state;
      //Billing Address
      if (field == "checked1") {
        fields["bcountry_id"] =
          (checked1 && fields["country_id"]) || oldFields["bcountry_id"] || "";

        fields["bstate_id"] =
          (checked1 && fields["state_id"]) || oldFields["bstate_id"] || "";

        fields["b_zipcode"] =
          (checked1 && fields["p_zipcode"]) || oldFields["b_zipcode"] || "";

        fields["b_city"] =
          (checked1 && fields["city"]) || oldFields["b_city"] || "";

        fields["b_address2"] =
          (checked1 && fields["p_address2"]) || oldFields["b_address2"] || "";

        fields["b_street"] =
          (checked1 && fields["p_street"]) || oldFields["b_street"] || "";
      }
      if (field == "checked2" || field == "checked3") {
        //Mailing Address
        fields["mcountry_id"] =
          (checked2 && fields["country_id"]) ||
          (checked3 && fields["bcountry_id"]) ||
          oldFields["mcountry_id"] ||
          "";
        fields["mstate_id"] =
          (checked2 && fields["state_id"]) ||
          (checked3 && fields["bstate_id"]) ||
          oldFields["mstate_id"] ||
          "";
        fields["m_zipcode"] =
          (checked2 && fields["p_zipcode"]) ||
          (checked3 && fields["b_zipcode"]) ||
          oldFields["m_zipcode"] ||
          "";

        fields["m_city"] =
          (checked2 && fields["city"]) ||
          (checked3 && fields["b_city"]) ||
          oldFields["m_city"] ||
          "";
        fields["m_address2"] =
          (checked2 && fields["p_address2"]) ||
          (checked3 && fields["b_address2"]) ||
          oldFields["m_address2"] ||
          "";
        fields["m_street"] =
          (checked2 && fields["p_street"]) ||
          (checked3 && fields["b_street"]) ||
          oldFields["m_street"] ||
          "";
      }
      this.setState({ fields });
    });
  };

  handleZipOnBlur = (e) => {
    e.preventDefault();
    let zType = "";
    zType = e.target.name.split("")[0];
    if (zType == "p") {
      zType = "";
    }
    let params = {
      zipcode: e.target.value,
    };
    if (e.target.value !== "") {
      user.getZipDetails(params).then((res) => {
        if (res.data.success) {
          let fields = this.state.fields;
          fields[`${zType}country_id`] = {
            label: res.data.user.pcountry.name,
            value: res.data.user.pcountry.id,
          };
          if (zType === "") {
            fields[`city`] = res.data.user.city;
          } else {
            fields[`${zType}_city`] = res.data.user.city;
          }
          fields[`${zType}state_id`] = {
            label: res.data.user.pstate && res.data.user.pstate.state,
            value: res.data.user.pstate && res.data.user.pstate.state_id,
          };
          this.setState(fields);
        }
      });
    } else {
      let fields = this.state.fields;
      fields[`${zType}country_id`] = {};
      if (zType == "") {
        fields["city"] = "";
      } else {
        fields[`${zType}_city`] = "";
      }
      fields[`${zType}state_id`] = {};
      this.setState(fields);
    }
  };

  promiseClinicOptions = (inputValue) => {
    if(this.searchTimeOut > 0){
      clearTimeout(this.searchTimeOut);
    }
    return new Promise((resolve) => {
      if (inputValue !== "") {
        this.searchTimeOut = setTimeout(() => {
          common.getClinicsByUser({ keyword: inputValue }).then((response) => {
            if (response.data.success) {
              let clinics = [];
              response.data.clinics.forEach((clinic, index) => {
                clinics[index] = { label: clinic.name, value: clinic.id };
              });
              this.setState({ clinics }, () => {
                resolve(this.filterClinic(inputValue));
              });
            }
          });
        }, 500);
      } else {
        resolve(this.filterClinic(inputValue));
      }
    });
  };

  filterClinic = (inputValue) => {
    return this.state.clinics.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  render() {
    const { fields, checked1, checked2, checked3, errors } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader className="text-left p-2">
            <strong style={{ fontSize: 20 }}>
              {this.props.match.params.id
                ? `Update ${fields["first_name"]}`
                : "Add New User"}
            </strong>
          </CardHeader>

          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === "1",
                  })}
                  onClick={() => this.setActiveTab("1")}
                  style={{ fontSize: 20 }}
                >
                  Basic Details
                </NavLink>
              </NavItem>{" "}
              {parseInt(this.props.userType) !== 15 && (
                <>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: this.state.activeTab === "2",
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
                        active: this.state.activeTab === "3",
                      })}
                      onClick={() => this.setActiveTab("3")}
                      style={{ fontSize: 20 }}
                    >
                      Notes
                    </NavLink>
                  </NavItem>
                </>
              )}
            </Nav>
            <TabContent activeTab={this.state.activeTab} className="mb-3">
              <TabPane tabId="1">
                <LoadingOverlay
                  active={this.state.loader}
                  spinner={<Spinner color="dark" />}
                  fadeSpeed={200}
                  classNamePrefix="mitiz"
                >
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup row>
                      <Col md={2}>
                        <Label>Prefix</Label>
                        <Input
                          type="text"
                          className="ml10"
                          name="prefix"
                          value={fields["prefix"] ? fields["prefix"] : ""}
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["prefix"] ? true : false}
                        />
                        {errors["prefix"] && (
                          <FormFeedback>{errors["prefix"]}</FormFeedback>
                        )}
                      </Col>
                      <Col md={3}>
                        <Label>First Name</Label>
                        <Input
                          type="text"
                          name="first_name"
                          value={
                            fields["first_name"] ? fields["first_name"] : ""
                          }
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["first_name"] ? true : false}
                        />
                        {errors["first_name"] && (
                          <FormFeedback>{errors["first_name"]}</FormFeedback>
                        )}
                      </Col>
                      <Col md={2}>
                        <Label>Middle Name</Label>
                        <Input
                          type="text"
                          className="ml10"
                          name="middle_name"
                          value={
                            fields["middle_name"] ? fields["middle_name"] : ""
                          }
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["middle_name"] ? true : false}
                        />
                        {errors["middle_name"] && (
                          <FormFeedback>{errors["middle_name"]}</FormFeedback>
                        )}
                      </Col>
                      <Col md={3}>
                        <Label>Last Name</Label>
                        <Input
                          type="text"
                          className="ml10"
                          name="last_name"
                          value={fields["last_name"] ? fields["last_name"] : ""}
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["last_name"] ? true : false}
                        />
                        {errors["last_name"] && (
                          <FormFeedback>{errors["last_name"]}</FormFeedback>
                        )}
                      </Col>
                      <Col md={2}>
                        <Label>Suffix</Label>
                        <Input
                          type="text"
                          className="ml10"
                          name="suffix"
                          value={fields["suffix"] ? fields["suffix"] : ""}
                          onChange={(e) => this.handleChange(e)}
                          invalid={errors["suffix"] ? true : false}
                        />
                        {errors["suffix"] && (
                          <FormFeedback>{errors["suffix"]}</FormFeedback>
                        )}
                      </Col>
                    </FormGroup>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Preferred Name</Label>
                          <Input
                            type="text"
                            name="preferred_name"
                            value={
                              fields["preferred_name"]
                                ? fields["preferred_name"]
                                : ""
                            }
                            onChange={(e) => this.handleChange(e)}
                            invalid={errors["preferred_name"] ? true : false}
                          />
                          {errors["preferred_name"] && (
                            <FormFeedback>
                              {errors["preferred_name"]}
                            </FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input
                            type="text"
                            name="email"
                            id="email"
                            value={fields["email"] ? fields["email"] : ""}
                            onChange={(e) => this.handleChange(e)}
                            invalid={errors["email"] ? true : false}
                            bsSize="lg"
                          />
                          {errors["email"] && (
                            <FormFeedback>{errors["email"]}</FormFeedback>
                          )}
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={4}>
                            <Label for="phone">Phone</Label>
                            <NumberFormat
                              format="(###) ###-####"
                              className="form-control-lg form-control"
                              name="phone"
                              value={fields["phone"] ? fields["phone"] : ""}
                              onChange={(e) => this.handleChange(e)}
                            />
                            {errors["phone"] && (
                              <small className="fa-1x text-danger">
                                {errors["phone"]}
                              </small>
                            )}
                          </Col>
                          <Col sm={4}>
                            <Label for="mobile">Cell Phone</Label>
                            <NumberFormat
                              format="(###) ###-####"
                              className="form-control-lg form-control"
                              name="mobile"
                              value={fields["mobile"] ? fields["mobile"] : ""}
                              onChange={(e) => this.handleChange(e)}
                            />
                            {errors["mobile"] && (
                              <small className="fa-1x text-danger">
                                {errors["mobile"]}
                              </small>
                            )}
                          </Col>
                          <Col sm={4}>
                            <Label for="fax">Fax</Label>
                            <NumberFormat
                              format="(###) ###-####"
                              className="form-control-lg form-control"
                              name="fax"
                              value={fields["fax"] ? fields["fax"] : ""}
                              onChange={(e) => this.handleChange(e)}
                            />
                            {errors["fax"] && (
                              <small className="fa-1x text-danger">
                                {errors["fax"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Label for="username">Username</Label>
                          <Input
                            type="text"
                            name="username"
                            id="username"
                            value={fields["username"] ? fields["username"] : ""}
                            onChange={(e) => this.handleChange(e)}
                            invalid={errors["username"] ? true : false}
                            bsSize="lg"
                          />
                          {errors["username"] && (
                            <FormFeedback>{errors["username"]}</FormFeedback>
                          )}
                        </FormGroup>
                        {/* {(this.props.userType == 1 ||
                          this.props.userId == this.props.match.params.id) && ( */}
                        <FormGroup>
                          <Label for="password">Password</Label>
                          <Input
                            type="text"
                            style={{ webkitTextSecurity: "disc" }}
                            name="password"
                            id="password"
                            value={fields["password"] ? fields["password"] : ""}
                            onChange={(e) => this.handleChange(e)}
                            invalid={errors["password"] ? true : false}
                            bsSize="lg"
                          />
                          {errors["password"] && (
                            <FormFeedback>{errors["password"]}</FormFeedback>
                          )}
                        </FormGroup>
                        {/* )} */}
                        <FormGroup row>
                          <Col sm={6}>
                            <Label for="npi">NPI</Label>
                            <Input
                              type="text"
                              name="npi"
                              id="npi"
                              value={
                                fields["npi"] && fields["npi"] != 0
                                  ? fields["npi"]
                                  : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["npi"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["npi"] && (
                              <FormFeedback>{errors["npi"]}</FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label>InivisAlign ID</Label>
                            <Input
                              type="number"
                              name="invisalignId"
                              value={
                                fields["invisalignId"] &&
                                fields["invisalignId"] != 0
                                  ? fields["invisalignId"]
                                  : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["invisalignId"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["invisalignId"] && (
                              <FormFeedback>
                                {errors["invisalignId"]}
                              </FormFeedback>
                            )}
                          </Col>
                        </FormGroup>
                        <h5>Licence Details</h5>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label for="lcountry_id">Country</Label>
                            <Select
                              name="lcountry_id"
                              id="lcountry_id"
                              placeholder={<div>Select Country...</div>}
                              value={
                                fields["lcountry_id"]
                                  ? fields["lcountry_id"]
                                  : { label: "United States", value: "254" }
                              }
                              options={this.state.lCountries}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={this.handleLcountryChange}
                            />
                            {errors["lcountry_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["lcountry_id"]}
                              </small>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label for="lstate_id">State</Label>
                            <Select
                              name="lstate_id"
                              id="lstate_id"
                              placeholder={<div>Select State...</div>}
                              value={fields["lstate_id"] && fields["lstate_id"]}
                              options={this.state.lStates}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={(e) =>
                                this.handleStateChange("lstate_id", e)
                              }
                            />
                            {errors["lstate_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["lstate_id"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Licence No.</Label>
                            <Input
                              type="text"
                              name="licence_no"
                              id="licence_no"
                              value={
                                fields["licence_no"] ? fields["licence_no"] : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["licence_no"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["licence_no"] && (
                              <FormFeedback>
                                {errors["licence_no"]}
                              </FormFeedback>
                            )}
                          </Col>
                          <Col sm={6} style={{marginTop:"2.5rem"}}>
                            <FormGroup check inline>
                              <Label>
                                <Input
                                  type="radio"
                                  name="l_status"
                                  value="Y"
                                  onChange={(e) => this.handleChange(e)}
                                  checked={fields["l_status"] === "Y" && true}
                                />
                                Active
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label>
                                <Input
                                  type="radio"
                                  name="l_status"
                                  value="N"
                                  onChange={(e) => this.handleChange(e)}
                                  checked={fields["l_status"] === "N" && true}
                                />
                                Inactive
                              </Label>
                            </FormGroup>
                          </Col>
                        </FormGroup>
                        {(common.imd_roles.includes(parseInt(this.props.userType))) && (
                          <FormGroup>
                            <Label for="clinics">Clinic</Label>
                            <AsyncSelect
                              cacheOptions
                              name="clinics"
                              id="clinics"
                              placeholder={<div>Select Clinic...</div>}
                              value={fields["clinics"] ? fields["clinics"] : []}
                              defaultOptions={
                                this.state.clinics ? this.state.clinics : []
                              }
                              className="basic-multi-select"
                              classNamePrefix="select"
                              isMulti
                              loadOptions={this.promiseClinicOptions}
                              invalid={errors["clinics"] ? true : false}
                              onChange={(option) =>
                                this.handleMultiChange("clinics", option)
                              }
                            />
                            {errors["clinics"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["clinics"]}
                              </small>
                            )}
                          </FormGroup>
                        )}
                        <FormGroup>
                          <Label for="locations">Location</Label>
                          <Select
                            name="locations"
                            id="locations"
                            placeholder={<div>Select Location...</div>}
                            value={
                              fields["locations"] ? fields["locations"] : []
                            }
                            options={this.state.locations}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            isMulti
                            invalid={errors["locations"] ? true : false}
                            onChange={(option) =>
                              this.handleMultiChange("locations", option)
                            }
                          />
                          {errors["locations"] && (
                            <small
                              style={{ fontSize: "12px" }}
                              className="fa-1x text-danger"
                            >
                              {errors["locations"]}
                            </small>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <h5>Physical Address</h5>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Building</Label>
                            <Input
                              type="text"
                              name="p_address2"
                              id="p_address2"
                              value={
                                fields["p_address2"] ? fields["p_address2"] : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["p_address2"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["p_address2"] && (
                              <FormFeedback>
                                {errors["p_address2"]}
                              </FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label>Street Address</Label>
                            <Input
                              type="text"
                              name="p_street"
                              id="p_street"
                              value={
                                fields["p_street"] ? fields["p_street"] : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["p_street"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["p_street"] && (
                              <FormFeedback>{errors["p_street"]}</FormFeedback>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>City</Label>
                            <Input
                              type="text"
                              name="city"
                              id="city"
                              value={fields["city"] ? fields["city"] : ""}
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["city"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["city"] && (
                              <FormFeedback>{errors["city"]}</FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label for="state_id">State</Label>
                            <Select
                              name="state_id"
                              id="state_id"
                              placeholder={<div>Select State...</div>}
                              value={fields["state_id"] && fields["state_id"]}
                              options={this.state.pStates}
                              className="basic-multi-select"
                              classNamePrefix="state_id"
                              onChange={(e) =>
                                this.handleStateChange("state_id", e)
                              }
                            />
                            {errors["state_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["state_id"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Zip Code</Label>
                            <NumberFormat
                              format="#########"
                              name="p_zipcode"
                              className={
                                errors["p_zipcode"]
                                  ? "change-border"
                                  : "form-control"
                              }
                              value={
                                fields["p_zipcode"] && fields["p_zipcode"] != 0
                                  ? fields["p_zipcode"].replace(/ /g, "")
                                  : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              onBlur={(e) => this.handleZipOnBlur(e)}
                            />
                            {errors["p_zipcode"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["p_zipcode"]}
                              </small>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label for="country_id">Country</Label>
                            <Select
                              name="country_id"
                              id="country_id"
                              placeholder={<div>Select Country...</div>}
                              value={
                                fields["country_id"]
                                  ? fields["country_id"]
                                  : { label: "United States", value: "254" }
                              }
                              options={this.state.pCountries}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={this.handlePcountryChange}
                            />
                            {errors["country_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["country_id"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <h5 className="mt-4">Billing Address</h5>
                        <Label check>
                          <input
                            type="checkbox"
                            name="checked1"
                            onChange={(e) => this.setAddress("checked1", e)}
                            checked={checked1}
                          />
                          {"  "}
                          Same as Physical Address
                        </Label>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Building</Label>
                            <Input
                              type="text"
                              name="b_address2"
                              id="b_address2"
                              value={
                                fields["b_address2"] ? fields["b_address2"] : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["b_address2"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["b_address2"] && (
                              <FormFeedback>
                                {errors["b_address2"]}
                              </FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label>Street Address</Label>
                            <Input
                              type="text"
                              name="b_street"
                              id="b_street"
                              value={
                                fields["b_street"] ? fields["b_street"] : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["b_street"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["b_street"] && (
                              <FormFeedback>{errors["b_street"]}</FormFeedback>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>City</Label>
                            <Input
                              type="text"
                              name="b_city"
                              id="b_city"
                              value={fields["b_city"] ? fields["b_city"] : ""}
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["b_city"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["b_city"] && (
                              <FormFeedback>{errors["b_city"]}</FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label for="bstate_id">State</Label>
                            <Select
                              name="bstate_id"
                              id="bstate_id"
                              placeholder={<div>Select State...</div>}
                              value={fields["bstate_id"] && fields["bstate_id"]}
                              options={
                                checked1
                                  ? this.state.pStates
                                  : this.state.bStates
                              }
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={(e) =>
                                this.handleStateChange("bstate_id", e)
                              }
                            />
                            {errors["bstate_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["bstate_id"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Zip Code</Label>
                            <NumberFormat
                              format="#########"
                              name="b_zipcode"
                              className={
                                errors["b_zipcode"]
                                  ? "change-border"
                                  : "form-control"
                              }
                              value={
                                fields["b_zipcode"] && fields["b_zipcode"] != 0
                                  ? fields["b_zipcode"].replace(/ /g, "")
                                  : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              onBlur={(e) => this.handleZipOnBlur(e)}
                            />
                            {errors["b_zipcode"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["b_zipcode"]}
                              </small>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label for="bcountry_id">Country</Label>
                            <Select
                              name="bcountry_id"
                              id="bcountry_id"
                              placeholder={<div>Select Country...</div>}
                              value={
                                fields["bcountry_id"]
                                  ? fields["bcountry_id"]
                                  : { label: "United States", value: "254" }
                              }
                              options={this.state.bCountries}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={this.handleBcountryChange}
                            />
                            {errors["bcountry_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["bcountry_id"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <h5>Mailing Address</h5>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label check>
                              <input
                                type="checkbox"
                                name="checked2"
                                onChange={(e) => this.setAddress("checked2", e)}
                                checked={checked2}
                              />
                              {"  "}
                              Same as Physical Address
                            </Label>
                          </Col>
                          <Col sm={6}>
                            <Label check>
                              <input
                                type="checkbox"
                                name="checked3"
                                onChange={(e) => this.setAddress("checked3", e)}
                                checked={checked3}
                              />
                              {"  "}
                              Same as Billing Address
                            </Label>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Building</Label>
                            <Input
                              type="text"
                              name="m_address2"
                              id="m_address2"
                              value={
                                fields["m_address2"] ? fields["m_address2"] : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["m_address2"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["m_address2"] && (
                              <FormFeedback>
                                {errors["m_address2"]}
                              </FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label>Street Address</Label>
                            <Input
                              type="text"
                              name="m_street"
                              id="m_street"
                              value={
                                fields["m_street"] ? fields["m_street"] : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["m_street"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["m_street"] && (
                              <FormFeedback>{errors["m_street"]}</FormFeedback>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>City</Label>
                            <Input
                              type="text"
                              name="m_city"
                              id="m_city"
                              value={fields["m_city"] ? fields["m_city"] : ""}
                              onChange={(e) => this.handleChange(e)}
                              invalid={errors["m_city"] ? true : false}
                              bsSize="lg"
                            />
                            {errors["m_city"] && (
                              <FormFeedback>{errors["m_city"]}</FormFeedback>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label for="mstate_id">State</Label>
                            <Select
                              name="mstate_id"
                              id="mstate_id"
                              placeholder={<div>Select State...</div>}
                              value={fields["mstate_id"] && fields["mstate_id"]}
                              options={
                                checked1
                                  ? this.state.pStates
                                  : this.state.mStates
                              }
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={(e) =>
                                this.handleStateChange("mstate_id", e)
                              }
                            />
                            {errors["mstate_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["mstate_id"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm={6}>
                            <Label>Zip Code</Label>
                            <NumberFormat
                              format="#########"
                              name="m_zipcode"
                              className={
                                errors["m_zipcode"]
                                  ? "change-border"
                                  : "form-control"
                              }
                              value={
                                fields["m_zipcode"] && fields["m_zipcode"] != 0
                                  ? fields["m_zipcode"].replace(/ /g, "")
                                  : ""
                              }
                              onChange={(e) => this.handleChange(e)}
                              onBlur={(e) => this.handleZipOnBlur(e)}
                            />
                            {errors["m_zipcode"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["m_zipcode"]}
                              </small>
                            )}
                          </Col>
                          <Col sm={6}>
                            <Label for="mcountry_id">Country</Label>
                            <Select
                              name="mcountry_id"
                              id="mcountry_id"
                              placeholder={<div>Select Country...</div>}
                              value={
                                fields["mcountry_id"]
                                  ? fields["mcountry_id"]
                                  : { label: "United States", value: "254" }
                              }
                              options={this.state.mCountries}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={this.handleMcountryChange}
                            />
                            {errors["mcountry_id"] && (
                              <small
                                style={{ fontSize: "12px" }}
                                className="fa-1x text-danger"
                              >
                                {errors["mcountry_id"]}
                              </small>
                            )}
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Label for="default_location">Default location</Label>
                        <Select
                          bsSize="lg"
                          name="default_location"
                          id="default_location"
                          options={this.state.locations}
                          value={
                            fields["default_location"] &&
                            fields["default_location"]
                          }
                          invalid={errors["default_location"] ? true : false}
                          className="input-bg"
                          onChange={(e) =>
                            this.handleStateChange("default_location", e)
                          }
                        ></Select>
                        {errors["default_location"] && (
                          <small
                            style={{ fontSize: "12px" }}
                            className="fa-1x text-danger"
                          >
                            {errors["default_location"]}
                          </small>
                        )}
                      </Col>
                      <Col md={6}>
                        {(common.imd_roles.includes(parseInt(this.props.userType))) && (
                          <>
                            <Label for="role_id">Role</Label>
                            <Input
                              type="select"
                              bsSize="lg"
                              name="role_id"
                              id="role_id"
                              onChange={(e) => this.handleChange(e)}
                              value={fields["role_id"] ? fields["role_id"] : ""}
                              invalid={errors["role_id"] ? true : false}
                              className="input-bg"
                            >
                              <option value="">
                                {this.state.roles.length === 0
                                  ? "Loading..."
                                  : "-Select-"}
                              </option>
                              {this.state.roles.map((role) => (
                                <option
                                  value={role.id}
                                  key={`key-role-${role.id}`}
                                >
                                  {role.name}
                                </option>
                              ))}
                            </Input>
                            {errors["role_id"] && (
                              <FormFeedback>{errors["role_id"]}</FormFeedback>
                            )}
                          </>
                        )}
                      </Col>
                    </Row>
                    {(common.imd_roles.includes(parseInt(this.props.userType))) && (
                      <Fragment>
                        <FormGroup check inline className="mt-3">
                          <Label>
                            <Input
                              type="radio"
                              name="status"
                              value="Y"
                              onChange={(e) => this.handleChange(e)}
                              checked={fields["status"] === "Y" && true}
                            />
                            Active
                          </Label>
                        </FormGroup>
                        <FormGroup check inline className="mt-3">
                          <Label>
                            <Input
                              type="radio"
                              name="status"
                              value="N"
                              onChange={(e) => this.handleChange(e)}
                              checked={fields["status"] === "N" && true}
                            />
                            Inactive
                          </Label>
                        </FormGroup>
                      </Fragment>
                   
                    )}
                    <Col xl={12} className="text-right">
                      <Link to="/admin/users" className="btn btn-danger mr-2">
                        Cancel
                      </Link>
                      {parseInt(this.props.userType) !== 15 ? (
                        <Button type="submit" color="success">
                          Next{" "}
                          <FontAwesomeIcon icon="forward" className="ml-1" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          color="success"
                          disabled={this.state.submitted}
                          onClick={this.handleSubmit}
                        >
                          {this.state.submitted && (
                            <FontAwesomeIcon
                              icon="spinner"
                              className="mr-1"
                              spin={true}
                            />
                          )}{" "}
                          {this.props.match.params.id ? "Update" : "Save"}
                        </Button>
                      )}
                    </Col>
                  </Form>
                </LoadingOverlay>
              </TabPane>
              {parseInt(this.props.userType) !== 15 && (
                <>
                  <TabPane tabId="2">
                    <Row>
                      <Col xl={4}>
                        <AddEditDocument
                          addDocument={this.addDocument}
                          documentTypes={this.state.documentTypes}
                          checkUploadedFile={this.checkUploadedFile}
                          handleReset={this.handleReset}
                        />
                      </Col>
                      <Col xl={8}>
                        <Documents
                          documents={this.state.documents}
                          documentTypes={this.state.documentTypes}
                          enableDelete={this.state.enableDeleteButton}
                          enableEdit={this.state.enableEditButton}
                          removeDocument={this.removeDocument}
                          uploadedOn={false}
                          title="Uploaded Documents"
                          chooseDocument={false}
                          serviceName={user}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={12} className="text-right">
                        <Button
                          type="button"
                          color="default"
                          disabled={this.state.submitted}
                          onClick={() => this.setActiveTab("1")}
                        >
                          <FontAwesomeIcon icon="backward" className="mr-1" />
                          Back
                        </Button>
                        <Button
                          type="button"
                          color="success"
                          disabled={this.state.submitted}
                          onClick={this.handleSubmit}
                        >
                          Next{" "}
                          <FontAwesomeIcon icon="forward" className="ml-1" />
                        </Button>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col xl={4}>
                        <AddEditNote
                          addNote={this.addNote}
                          noteFields={this.state.noteFields}
                          noteIndex={this.state.noteIndex}
                          handleReset={this.handleReset}
                          checkNotesAdded={this.checkNotesAdded}
                        />
                      </Col>
                      <Col xl={8}>
                        <Notes
                          notes={this.state.notes}
                          enableDelete={true}
                          enableEdit={true}
                          removeNote={this.removeNote}
                          fillNote={this.fillNote}
                          addedOn={false}
                          addedBy={false}
                          title="All Notes"
                          key={this.state.noteIndex}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={12} className="text-right">
                        <Button
                          type="button"
                          color="default"
                          disabled={this.state.submitted}
                          onClick={() => this.setActiveTab("2")}
                        >
                          <FontAwesomeIcon icon="backward" className="mr-1" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          color="success"
                          disabled={this.state.submitted}
                          onClick={this.handleSubmit}
                        >
                          {this.state.submitted && (
                            <FontAwesomeIcon
                              icon="spinner"
                              className="mr-1"
                              spin={true}
                            />
                          )}{" "}
                          {this.props.match.params.id ? "Update" : "Save"}
                        </Button>
                      </Col>
                    </Row>
                  </TabPane>
                </>
              )}
            </TabContent>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userType: state.userType,
    userId: state.userId,
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

export default connect(mapStateToProps, mapDispatchToProps)(AddEditUser);
