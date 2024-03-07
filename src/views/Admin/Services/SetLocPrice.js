import React, { Component } from "react";
import {
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  FormGroup,
  Spinner,
  Input,
  Form,
  CustomInput
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import service from "../../../services/service";
import location from "../../../services/location";
import { toast } from "react-toastify";
import Location from "../Locations/Location";
import LoadingOverlay from "react-loading-overlay";

class SetLocPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      locations: [],
      submitted: false,
      isLoader: false,
      checkAll: false
    };
  }
  componentDidMount = () => {
    this.setState({ isloader: true });
    let that = this;
    location
      .list()
      .then(response => {
        this.setState({ isloader: false }, () => {
          if (response.data.success) {
            let fields = this.state.fields;
            if (this.props.locations.length > 0) {
              this.props.locations.forEach(location => {
                fields[`${location.location_id}`] = {
                  status: location.status,
                  price: location.price
                };
              });
            }
            this.setState({
              locations: response.data.locations,
              fields
            });
          }
        });
      })
      .catch(function(error) {
        that.setState({ error_403: true });
      });
  };

  handleChange = (field, e, value) => {
    let fields = this.state.fields;
    if (e.target.type === "checkbox") {
      if (field === "checkAll") {
        this.setState({ checkAll: e.target.checked });
        this.props.locations.map(loc => {
          fields[`${loc.location_id}`] = {
            status: e.target.checked ? "Y" : "N",
            price: loc.price
          };
        });
        let locationIds = this.props.locations.map(l => l.location_id);
        this.state.locations
          .filter(l => !locationIds.includes(l.id))
          .map(
            loc =>
              (fields[`${loc.id}`] = {
                status: e.target.checked ? "Y" : "N",
                price: ""
              })
          );
      } else if (field !== "checkAll" && value !== undefined) {
        fields[field] = { status: e.target.checked ? "Y" : "N", price: value };
        this.setState({ checkAll: false });
      }
    } else {
      fields[field] = { status: value, price: e.target.value };
    }
    this.setState({ fields });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ submitted: true });
    const params = {
      service_id: this.props.serviceId,
      locations: this.state.fields
    };
    //console.log(this.state);
    let that = this;
    service
      .addLocationPrice(params)
      .then(response => {
        this.setState({ submitted: false }, () => {
          if (response.data.success) {
            if (response.data.message) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT
              });
            }
            this.props.toggleLocationModal();
          } else if (response.data.error) {
            toast.error(response.data.message, {
              position: toast.POSITION.TOP_RIGHT
            });
            this.props.toggleLocationModal();
          }
        });
      })
      .catch(function(error) {
        that.setState({ submitted: false });
      });
  };
  render() {
    return (
      <Modal isOpen={this.props.showLocationModal} size="lg">
        <ModalHeader toggle={this.props.toggleLocationModal}>
          Set Location Price
        </ModalHeader>
        <ModalBody className="pl-4 pr-4" style={{ minHeight: 250 }}>
          <LoadingOverlay
            active={this.state.isloader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Form method="post" onSubmit={this.handleSubmit}>
              <div className="animated fadeIn">
                <Table responsive hover className="table-striped">
                  <thead>
                    <tr>
                      <th scope="col" className="border-top-0">
                        <CustomInput
                          type="switch"
                          name="checkAll"
                          id="checkAll"
                          checked={this.state.checkAll ? true : false}
                          onChange={e => this.handleChange("checkAll", e)}
                          className="cform-check-input ml-0 mt-0"
                        />
                      </th>
                      <th scope="col" className="border-top-0">
                        Published Name
                      </th>
                      <th scope="col" className="border-top-0">
                        Address
                      </th>
                      <th scope="col" className="border-top-0">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.locations.map((location, index) => (
                      <Location
                        location={location}
                        key={`key-location-${index}`}
                        enableEditDelete={false}
                        enablePrice={true}
                        handleChange={this.handleChange}
                        fields={this.state.fields}
                      />
                    ))}
                  </tbody>
                </Table>
              </div>
              <Row>
                <Col md={12} className="text-right">
                  <button
                    type="button"
                    className="btn btn-outline-dark cp mr-1"
                    disabled={this.state.submitted}
                    onClick={this.props.toggleLocationModal}
                  >
                    Cancel{this.state.submitted}
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
        </ModalBody>
      </Modal>
    );
  }
}
export default SetLocPrice;
