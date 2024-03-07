import React, { Component } from "react";
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
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import service from "../../../services/service";
import common from "../../../services/common";

class UpdateAppearance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loader: true,
      fields: {},
      errors: {},
      services: [],
      submitted: false
    };
  }
  handleChange = (e) => {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({ fields });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitted: true });
      const params = {
        fields: this.state.fields
      };
      service.updateAppearance(params).then(response => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
              });
              this.props.toggleModal();
            } else if (response.data.error) {
                toast.error(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
          });
        }).catch((error) => {
          this.setState({ submitted: false });
        });
  };

  componentDidMount = () => {
    common.getParentServices().then(response =>{
        if (response.data.success) {
            let fields = {};
            response.data.services.forEach((service,index)=>{
                fields[service.id] = service.sequence;
            });
            this.setState({
              loader: false,
              fields,
              services:response.data.services
            });
          } 
        }
    );
  };

  render() {
    return (
      <Modal isOpen={this.props.showModal}>
        <Form
          name="add-edit-action-form"
          method="post"
          onSubmit={this.handleSubmit}
        >
          <ModalHeader toggle={this.props.toggleModal}>Update Appearance</ModalHeader>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <ModalBody className="pl-4 pr-4">
                {this.state.services.map((service,index)=><Row key={`parent-service-key-${index}`} className="mb-2">
                    <Col md={8}>{service.name}</Col>
                    <Col md={4}>
                        <Input
                            type="number"
                            name={service.id}
                            id={service.id}
                            value={this.state.fields[service.id]}
                            onChange={this.handleChange}
                    /></Col>
                </Row>)}
            </ModalBody>
            <ModalFooter>
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
            </ModalFooter>
          </LoadingOverlay>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    baseUrl: state.baseUrl
  };
};
export default connect(mapStateToProps)(UpdateAppearance);
