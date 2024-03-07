import React, { Component } from "react";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import form from "../../../services/form";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
  Button,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { ReactFormBuilder } from "react-form-builder2";
import "react-form-builder2/dist/app.css";

class AddEditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        form_json: [],
      },
      tools: [
        { key: "Header" },
        { key: "Label" },
        { key: "Paragraph" },
        { key: "LineBreak" },
        { key: "Dropdown" },
        { key: "Tags" },
        { key: "Checkboxes" },
        { key: "RadioButtons" },
        { key: "TextInput" },
        { key: "NumberInput" },
        { key: "TextArea" },
        { key: "TwoColumnRow" },
        { key: "ThreeColumnRow" },
        { key: "FourColumnRow" },
        // { key: "Image" },
        { key: "Rating" },
        { key: "DatePicker" },
        { key: "HyperLink" },
        { key: "Download" },
        { key: "Range" },
        // { key: "Camera" },
      ],
      errors: {},
      submitted: false,
      loader: false,
      showForm: false,
    };
  }

  collectData = (data) => {
    console.log(data);
    let fields = this.state.fields;
    fields["form_json"] = data.task_data;
    this.setState({ fields });
  };

  saveData = (e) => {
    e.preventDefault();
    if (this.state.fields.form_json.length === 0) {
      let errors = this.state.errors;
      errors["form_json"] = "Form can not be blank.";
      toast.error("Form can not be blank.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({ errors });
    } else {
      this.setState({ submitted: true });
      form.addForm({ fields: this.state.fields }).then((res) => {
        if (res.data.success) {
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          this.props.history.push(`/admin/forms`);
        } else if (res.data.error) {
          this.setState({ errors: res.data.message });
          toast.error(res.data.message.name[0], {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        this.setState({ submitted: false });
      });
    }
  };

  componentDidMount = () => {
    if (this.props.match.params.id) {
      form.getOne({ id: this.props.match.params.id }).then((res) => {
        if (res.data.success) {
          let fields = this.state.fields;
          fields = res.data.form;
          this.setState({ fields, showForm: true });
        } else if (res.data.error) {
          toast.error(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    } else {
      this.setState({ showForm: true });
    }
  };

  handleChange = (e) => {
    let fields = this.state.fields;
    fields["name"] = e.target.value;
    this.setState({ fields });
  };
  render() {
    return (
      <div className="animated fadeIn">
        <form onSubmit={this.saveData}>
          <Row>
            <Col xl={12}>
              <Card>
                <LoadingOverlay
                  active={this.state.loader}
                  spinner={<Spinner color="dark" />}
                  fadeSpeed={200}
                  classNamePrefix="mitiz"
                >
                  <CardHeader>
                    <Row>
                      <Col xs={12}>
                        <strong>
                          {this.props.match.params.id ? "Update " : "Add "} Form
                        </strong>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Row className="pb-5">
                      <Col sm={12}>
                        <FormGroup>
                          <Label>Name</Label>
                          <Input
                            name="name"
                            onChange={(e) => this.handleChange(e)}
                            // placeholder="Form Name"
                            value={
                              this.state.fields.name
                                ? this.state.fields.name
                                : ""
                            }
                          />
                          {this.state.errors["name"] && (
                            <small className="fa-1x text-danger">
                              {this.state.errors["name"]}
                            </small>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        {this.state.showForm ? (
                          <ReactFormBuilder
                            toolbarItems={this.state.tools}
                            onPost={this.collectData}
                            data={this.state.fields.form_json}
                          />
                        ) : (
                          <p className="text-center p-5">
                            <Spinner size="lg" />
                          </p>
                        )}
                        {this.state.errors["form_json"] && (
                          <small className="fa-1x text-danger">
                            {this.state.errors["form_json"]}
                          </small>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="mt-2">
                        <Button
                          color="success"
                          type="submit"
                          disabled={this.state.submitted}
                          size="lg"
                        >
                          {this.state.submitted && (
                            <Spinner
                              size="sm"
                              color="#887d7d"
                              className="mr-1 mb-1"
                            />
                          )}
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </LoadingOverlay>
              </Card>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default AddEditForm;
