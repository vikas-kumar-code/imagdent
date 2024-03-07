import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import common from "../../../services/common";
import { ReactBingmaps } from "react-bingmaps";
import Axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "reactstrap";
const bingApiKey =
  "AmJ26lI2p2_YnEHIZdppmT_Mc4_TWk3neYJVQPN5DNrlFHg6kRDSCd7xZxLVvdLN";
const geoCordinate = "https://dev.virtualearth.net/REST/v1/Locations/";
const mapRedirect = "https://bing.com/maps/default.aspx?";

class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      locationCordinates: [],
      fields: {},
      errors: {},
      submitted: false,
      address: [],
    };
  }

  callBackMethod = (e) => {
    console.log(e.street_address, e.city);
    let street_address = e.street_address.split(" ").join("%20%");
    let city = e.city.split(" ").join("%20%");
    const url = mapRedirect + "rtp=~adr." + street_address + city;
    console.log(url);
    return window.open(url, "_blank");
  };

  getLocationCordinate = (city, pin, addressLines) => {
    pin = pin.trim();
    return Axios.get(
      `${geoCordinate}${city}/${pin}/${addressLines}?&key=${bingApiKey}`
    )
      .then((res) => res)
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount = () => {
    window.scrollTo(0, 0);
    common.getLocation().then((res) => {
      if (res.data.success) {
        this.setState({ locations: res.data.locations });
        if (this.state.locations.length > 0) {
          this.state.locations.map((ele, index) => {
            setTimeout(() => {
              this.getLocationCordinate(
                ele.city,
                ele.Zipcode,
                ele.street_address
              ).then((res) => {
                this.setState({
                  locationCordinates: [
                    ...this.state.locationCordinates,
                    {
                      location:
                        res.data.resourceSets[0].resources[0].point.coordinates,
                      addHandler: "mouseover",
                      infoboxOption: {
                        title: ele.publish_name,
                        description:
                          ele.street_address +
                          "<br/> " +
                          ele.city +
                          ", " +
                          ele.Zipcode +
                          `<br/><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAA9ElEQVQ4jc3UsUoDQRDG8d8lWlkqKiIxaK21jS/gE6QQX0NUAva+hr6JnRaivbEQLcRCBJuAZ7F73OU88OKK+MHCDLPzZ3Zndvnvyir2KgboRv8B5ynwA+SV9YGlaSGdiv1ci2WpwKeG+GYK8FY4alVb0wLrulLe4Qi9VOAwwu7RT4XBAl5xg9mfALo1/z2CBtG+SKmu0JzQoDF2fwMIG3jBWwO0h1PsCVOw3Ba6E6FjHGJGaNTI5IvKsd8Wuq6cz2uh+3VYjpMiofOVMaE7bAvj1Mda20raaB7HuBQ+jmqFR8WmrDH1e60oG7KIMzwmFPuH+gQ2ezZP8eIASwAAAABJRU5ErkJggg=="/> :` +
                          ele.HomePhone +
                          `<br/><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAABOUlEQVQ4ja3UvyuFURzH8RfdicUgJWVTFEkZiUyyUQajyeQvMDH4C0Thdsstm0mxM5AfsSkZpMQkpSwUwzm3Ho/r3uc++da3vs85n+d9Pt/znOfwz9GUQbOE6Qy6YSigFb2JiXfcJJ67sYDLGrCLSlHAKfpTgkWsZXD1K5qrwGAgD6wC/CuGcYyZjKwLLBVqCOYxEuu+OrCWqBmsBUzOlev6i+/Uajkd67jGFTbwiRU8J0WNAEs4EU5FCa/Ywt0Piw0AD9EW61m04wydeR0OYTXmEJ7QhYO8DnfRE+uJ6Gwf43kdlnEecwdv2MR9XiDZLhPP+ErlsnAk0uP18qkg7MGosMHveMReXOwWg7GtjzrGvnCUHJhEMSXqEK6tTK1WiyK2ha84J/zwY40Aqq08JWzDi3BUHhoBfgPVlUUszUwVcwAAAABJRU5ErkJggg=="/> :` +
                          ele.fax,
                      },
                      infoboxAddHandler: {
                        type: "click",
                        callback: () => this.callBackMethod(ele),
                      },
                      pushPinOption: {
                        title: ele.publish_name,
                      },
                    },
                  ],
                });
              });
            }, index * 500)
          });
        }
      }
    });
  };

  handleChange = (e, field) => {
    let fields = this.state.fields;
    console.log(this.state.locations, e.target.value);
    if (e.target.name === "location") {
      fields[e.target.name] = this.state.locations[parseInt(e.target.value)];
    } else fields[e.target.name] = e.target.value;
    this.setState({ fields });
  };
  handleValidation = () => {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Please enter your full name.";
    }
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Please enter your email address.";
    }
    if (!fields["subject"]) {
      formIsValid = false;
      errors["subject"] = "Please enter subject.";
    }
    if (!fields["location"]) {
      formIsValid = false;
      errors["location"] = "Please choose location.";
    }
    if (!fields["body"]) {
      formIsValid = false;
      errors["body"] = "Please enter your message.";
    }
    this.setState({ errors: errors });
    return formIsValid;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      this.setState({ submitted: true });
      common
        .contactUs({ fields: this.state.fields })
        .then((response) => {
          this.setState({ submitted: false }, () => {
            if (response.data.success) {
              toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
              });
              this.setState({ fields: {} });
            } else if (response.data.error) {
              if (response.data.message) {
                this.setState({ errors: response.data.message });
              }
            }
          });
        })
        .catch((error) => {
          this.setState({ submitted: false });
        });
    }
    console.log(this.state.fields);
  };

  render() {
    const { errors } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>Locations - iMagDent</title>
        </Helmet>
        <div className="page-content">
          <div className="section mt-0">
            <div className="breadcrumbs-wrap">
              <div className="container">
                <div className="breadcrumbs">
                  <Link to="/">Home</Link>
                  <span>Locations</span>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <h1>Locations</h1>
            <div className="h-decor" />
            <div className="section page-content-first">
              <div className="container">
                <div className="row mb-5">
                  <div className="col-md-8">
                    <div className="google_map mb-3">
                      <ReactBingmaps
                        zoom={5}
                        bingmapKey={bingApiKey}
                        center={[32.786774, -96.806625]}
                        mapTypeId={"canvasLight"}
                        infoboxesWithPushPins={this.state.locationCordinates}
                      ></ReactBingmaps>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="contact_us_map">
                      <form onSubmit={this.handleSubmit} method="post">
                        <h2 className="mb-3">Contact Us</h2>
                        <div className="form-group">
                          <label for="name">Enter First and Last Name</label>
                          <input
                            name="name"
                            id="name"
                            type="text"
                            class="form-control"
                            bsSize="lg"
                            value={
                              this.state.fields["name"]
                                ? this.state.fields["name"]
                                : ""
                            }
                            onChange={(e) => this.handleChange(e, "name")}
                          />
                          {errors["name"] && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {errors["name"]}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label for="email">Enter Email Address</label>
                          <input
                            name="email"
                            id="email"
                            type="text"
                            class="form-control"
                            value={
                              this.state.fields["email"]
                                ? this.state.fields["email"]
                                : ""
                            }
                            bsSize="lg"
                            onChange={(e) => this.handleChange(e, "email")}
                          />
                          {errors["email"] && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {errors["email"]}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label for="subject">Enter Subject</label>
                          <input
                            name="subject"
                            id="subject"
                            type="text"
                            class="form-control"
                            value={
                              this.state.fields["subject"]
                                ? this.state.fields["subject"]
                                : ""
                            }
                            bsSize="lg"
                            onChange={(e) => this.handleChange(e, "subject")}
                          />
                          {errors["subject"] && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {errors["subject"]}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label for="location">Select Location</label>
                          <select
                            className="select_location"
                            name="location"
                            onChange={(e) => this.handleChange(e, "location")}
                          >
                            <option selected value="">
                              Select Location
                            </option>
                            {this.state.locations.length > 0 &&
                              this.state.locations.map((ele, index) => (
                                <option key={ele.id} value={index}>
                                  {ele.city}
                                </option>
                              ))}
                          </select>
                          {errors["location"] && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {errors["location"]}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label for="body">Your Comment</label>
                          <textarea
                            rows="3"
                            placeholder="Message"
                            name="body"
                            onChange={(e) => this.handleChange(e, "body")}
                          >
                            {this.state.fields["body"]
                              ? this.state.fields["body"]
                              : ""}
                          </textarea>
                          {errors["body"] && (
                            <div
                              style={{
                                color: "red",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {errors["body"]}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn"
                          type="submit"
                          disabled={this.state.submitted}
                        >
                          {this.state.submitted && <Spinner size="sm" />} Send
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Locations;
