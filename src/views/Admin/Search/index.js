import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Label,
  Input,
  Form,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NumberFormat from "react-number-format";
import DateRangePicker from "react-bootstrap-daterangepicker";
//import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import common from "../../../services/common";
import AsyncSelect from "react-select/async";
import PhoneInput from "react-phone-input-2";
import { element } from "prop-types";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: {},
      errors: {},
      submitted: false,
      dateFormat: "MM-DD-YYYY",
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
        "Last Three Months": [moment().subtract(3, "month"), moment()],
        "Last Six Months": [moment().subtract(6, "month"), moment()],
      },
      autoUpdateInput: false,
    };
  }
  handleChange = (field, e) => {
    let fields = this.state.fields;
    if (e.target && e.target !== undefined) fields[field] = e.target.value;
    else if (e.value !== undefined) fields[field] = e.value;
    else fields[field] = e;
    this.setState({ fields });
  };

  handleSelectSearchChange = (val, name) => {
    let fields = this.state.fields;
    fields[name] = val;
    this.setState({ fields });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.searchRecord(this.state.fields);
    if (this.props.getFieldsfromSearch) {
      this.props.getFieldsfromSearch(this.state.fields);
    }
  };
  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.defaultLocation !== this.props.defaultLocation) {
      let fields = {};
      fields["location_id"] = this.props.defaultLocation;
      fields["status"] = this.props.fields["status"];
      this.setState({ fields });
    }
  };
  componentDidMount = () => {
    let fields = this.props.fields;
    if (common.isEmptyObject(this.props.fields)) {
      fields = {};
    }
    this.setState({ fields });
  };
  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.props.clearSearch();
    });
  };
  /* componentDidMount = () => {
    if (!common.isEmptyObject(this.props.savedSearchFields)) {
      this.setState({ fields: this.props.savedSearchFields });
    }
  }; */
  handleDateFeild = (date) => {
    let fields = this.state.fields;
    fields["BirthDate"] = date;
    this.setState({ fields });
  };
  /* handleEvent(event, picker) {
    console.log(picker.startDate);
  } */
  handleCallback = (startDate, endDate, label) => {
    //console.log(startDate, endDate, label);
    //console.log(start.format('YYYY-MM-DD'));
    let fields = this.state.fields;
    fields["date_range"] =
      startDate.format("MM-DD-YYYY") + " to " + endDate.format("MM-DD-YYYY");
    this.setState({ fields });
    //console.log(fields['date_range']);
  };
  clearDateRange = () => {
    let fields = this.state.fields;
    fields["date_range"] = "";
    this.setState({ fields });
  };
  render() {
    return (
      <Collapse isOpen={this.props.isOpen}>
        <Card className="mt-2">
          <CardHeader className="bg-primary">{this.props.heading}</CardHeader>
          <CardBody>
            <Form
              name="add-edit-action-form"
              method="post"
              onSubmit={this.handleSubmit}
            >
              <Row>
                {this.props.searchFields.length > 0 &&
                  this.props.searchFields.map((el, ind) => (
                    <Col
                      md={el.grid !== undefined ? el.grid : 4}
                      key={`search-field-key-${ind}`}
                    >
                      <FormGroup className="mb-2 mr-sm-2 mb-3">
                        <Label for={el.name} className="mr-sm-2">
                          {el.label}
                        </Label>
                        {el.type === "text" && (
                          <Input
                            type="text"
                            name={el.name}
                            id={el.name}
                            value={
                              this.state.fields[el.name]
                                ? this.state.fields[el.name]
                                : ""
                            }
                            onChange={(event) =>
                              this.handleChange(el.name, event)
                            }
                            className="input-bg"
                            autoComplete="none"
                          />
                        )}
                        {el.name === "phone" && (
                          <PhoneInput
                            // onlyCountries={["us", "in", "jp"]}
                            onlyCountries={["us"]}
                            value={
                              this.state.fields[el.name]
                                ? this.state.fields[el.name]
                                : ""
                            }
                            onChange={(event) =>
                              this.handleChange(el.name, event)
                            }
                            country="us"
                            specialLabel={null}
                            name={el.name}
                            id={el.name}
                          />
                        )}
                        {el.name === "Zipcode" && (
                          <NumberFormat
                            format="#########"
                            className="form-control"
                            value={
                              this.state.fields[el.name]
                                ? this.state.fields[el.name]
                                : ""
                            }
                            name={el.name}
                            id={el.name}
                            onChange={(event) =>
                              this.handleChange(el.name, event)
                            }
                          />
                        )}
                        {el.name === "SocialSecurityNumber" && (
                          <NumberFormat
                            format="###-##-####"
                            className="form-control"
                            value={
                              this.state.fields[el.name]
                                ? this.state.fields[el.name]
                                : ""
                            }
                            name={el.name}
                            id={el.name}
                            onChange={(event) =>
                              this.handleChange(el.name, event)
                            }
                          />
                        )}

                        {el.type === "select" && (
                          <Input
                            type="select"
                            name={el.name}
                            id={el.name}
                            onChange={(event) =>
                              this.handleChange(el.name, event)
                            }
                            value={
                              this.state.fields[el.name]
                                ? this.state.fields[el.name]
                                : ""
                            }
                            className="input-bg"
                          >
                            <option value="">-Select-</option>
                            {el.values.map((v) => (
                              <option
                                value={v.value}
                                key={`key-input-${v.value}`}
                              >
                                {v.label}
                              </option>
                            ))}
                          </Input>
                        )}
                        {el.type === "date" && (
                          <DatePicker
                            showYearDropdown
                            showMonthDropdown
                            className="form-control"
                            style={{ width: 100 + "%", float: "left" }}
                            selected={
                              this.state.fields["BirthDate"]
                                ? this.state.fields["BirthDate"]
                                : ""
                            }
                            onChange={this.handleDateFeild}
                            dateFormat="MM/dd/yyyy"
                            placeholderText={el.placeholder}
                          />
                        )}
                        {el.type === "select-with-search" && (
                          <Select
                            name={el.name}
                            value={
                              this.state.fields[el.name]
                                ? this.state.fields[el.name]
                                : el.name == "location_id" &&
                                  this.props.defaultLocation !== undefined
                                  ? el.values.filter(
                                    (v) =>
                                      parseInt(v.value) ===
                                      parseInt(this.props.defaultLocation.value)
                                  )
                                  : ""
                            }
                            options={el.values}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(val, name) =>
                              this.handleSelectSearchChange(val, el.name)
                            }
                            isClearable
                          />
                        )}

                        {el.type === "select-with-search-multiple" && (
                          <Select
                            name={el.name}
                            value={
                              this.state.fields[el.name]
                                ? this.state.fields[el.name]
                                : el.name == "location_id" &&
                                  this.props.defaultLocation !== undefined
                                  ? el.values.filter(
                                    (v) =>
                                      parseInt(v.value) ===
                                      parseInt(this.props.defaultLocation.value)
                                  )
                                  : ""
                            }
                            options={el.values}
                            className="basic-multi-select"
                            isMulti={true}
                            classNamePrefix="select"
                            onChange={(val, name) =>
                              this.handleSelectSearchChange(val, el.name)
                            }
                            isClearable
                          />
                        )}

                        {el.type === "select-with-ajax-search" && (
                          <AsyncSelect
                            cacheOptions
                            name={el.name}
                            value={
                              this.state.fields[el.name] 
                              ? this.state.fields[el.name] 
                              : ""
                            }
                            defaultOptions={
                              this.state.users ? this.state.users : []
                            }
                            className="basic-multi-select"
                            classNamePrefix="select"
                            loadOptions={el.loadOptions}
                            onChange={(val, name) =>
                              this.handleSelectSearchChange(val, el.name)
                            }
                            isClearable={true}
                          // placeholder={this.state.dropdownPlaceholder}
                          />
                        )}

                        {el.type === "date-range" && (
                          <DateRangePicker
                            initialSettings={{
                              locale: {
                                format: this.state.dateFormat,
                                cancelLabel: "Clear",
                              },
                              ranges: this.state.ranges,
                              autoUpdateInput: false,
                            }}
                            /* onEvent={this.handleEvent} */ onCallback={
                              this.handleCallback
                            }
                            onCancel={this.clearDateRange}
                          >
                            <input
                              className="input-bg form-control"
                              name="date_range"
                              value={
                                this.state.fields["date_range"] &&
                                this.state.fields["date_range"]
                              }
                            />
                          </DateRangePicker>
                        )}
                      </FormGroup>
                    </Col>
                  ))}
              </Row>
              <Row>
                <Col lg={12} className="text-right">
                  <button
                    type="submit"
                    className="btn btn-danger mr-1"
                    disabled={this.state.submitted}
                  >
                    {this.state.submitted && (
                      <FontAwesomeIcon
                        icon="spinner"
                        className="mr-1"
                        spin={true}
                      />
                    )}
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={this.clearSearch}
                  >
                    Clear
                  </button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Collapse>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    //savedSearchFields: state.searchPatientData.searchFields,
  };
};
export default connect(mapStateToProps)(Search);
