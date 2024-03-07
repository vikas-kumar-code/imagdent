import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Carousel,
  CarouselItem,
  CarouselIndicators,
  Spinner,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import common from "../../../services/common";
import LoadingOverlay from "react-loading-overlay";
import fblogo from "../../../assets/images/fblogo.png";
import { BsFacebook, BsFillEnvelopeFill } from "react-icons/bs";

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      activeIndex: 0,
      animating: false,
      overLayLoader: true,
      loader: true,
      locations: [],
      address: [],
      locationIndex: 0,
    };
  }
  next = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === this.state.items.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };
  previous = () => {
    if (this.state.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.items.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  };
  setAnimating = (animate) => {
    this.setState({ animating: animate });
  };
  goToIndex = (newIndex) => {
    if (this.state.animating) return;
    this.setState({ activeIndex: newIndex });
  };
  componentDidMount = () => {
    common
      .getBanners({})
      .then((response) => {
        this.setState({ loader: false });
        if (response.data.success) {
          let items = [];
          response.data.banners.forEach((banner, index) => {
            items[index] = {
              html: (
                <React.Fragment>
                  <img
                    className="d-block w-100"
                    src={`${this.props.baseUrl}/images/${banner.file_name}`}
                    alt="First slide"
                  />
                  <div dangerouslySetInnerHTML={{ __html: banner.html }} />
                </React.Fragment>
              ),
            };
          });
          this.setState({ items, overLayLoader: false });
        }
      })
      .catch((error) => {
        this.setState({ error_403: true });
      });
    common.getLocation().then((res) => {
      let address = [];
      this.setState({ locations: res.data.locations });
      res.data.locations.map((ele) => {
        let obj = {};
        obj["street_address"] = ele.street_address;
        obj["city"] = ele.city;
        obj["fax"] = ele.fax;
        obj["HomePhone"] = ele.HomePhone;
        obj["email"] = ele.email;
        obj["Zipcode"] = ele.Zipcode;
        obj["state"] = ele.state ? ele.state.state : "";
        obj["fb_url"] = ele.fb_url;
        obj["file_name"] = ele.file_name;

        address.push(obj);
      });
      this.setState({ address: address });
    });
  };

  toggleLocation = (e, id) => {
    e.preventDefault();
    this.setState({ locationIndex: id });
  };

  active = (id) => {
    if (id === this.state.locationIndex) {
      return "active";
    } else return "";
  };

  render() {
    return (
      <React.Fragment>
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-ride="carousel"
        />
        <LoadingOverlay
          active={this.state.overLayLoader}
          spinner={<Spinner color="dark" />}
          fadeSpeed={200}
          classNamePrefix="mitiz"
        >
          <div className="carousel-inner" style={{ minHeight: 515 }}>
            <div className="quickLinks-wrap js-quickLinks-wrap-d d-none d-lg-flex">
              <div className="sticky-wrapper">
                <div className="quickLinks js-quickLinks">
                  <div className="container">
                    <div className="row no-gutters">
                      <div className="col">
                        <a href={void(0)} className="link">
                          <i className="icon-placeholder" />
                          <span>Locations</span>
                        </a>
                        <div className="link-drop custom-location-tab custom-location-style">
                          <h5 className="link-drop-title">
                            <i className="icon-placeholder" />
                            Location
                          </h5>
                          <div className="row">
                            <div className="col-4">
                              {this.state.locations.length > 0 &&
                                this.state.locations.map((loc, index) => (
                                  <div
                                    className="nav flex-column nav-pills"
                                    id="v-pills-tab"
                                    role="tablist"
                                    aria-orientation="vertical"
                                    key={index + 1}
                                  >
                                    <a
                                      className={`nav-link ${this.active(
                                        index
                                      )}`}
                                      style={{
                                        cursor: "pointer",
                                        textTransform: "uppercase",
                                      }}
                                      id="v-pills-ABILENE-tab"
                                      data-toggle="pill"
                                      onClick={(e) =>
                                        this.toggleLocation(e, index)
                                      }
                                      role="tab"
                                      aria-controls="v-pills-ABILENE"
                                      aria-selected="true"
                                    >
                                      {loc.city}
                                    </a>
                                  </div>
                                ))}
                            </div>
                            <div className="col-8">
                              <div
                                className="tab-content border-0 bg-transparent"
                                id="v-pills-tabContent"
                              >
                                {this.state.address.length > 0 &&
                                  this.state.address[
                                    `${this.state.locationIndex}`
                                  ] && (
                                    <div
                                      className="tab-pane fade show active"
                                      id="v-pills-ABILENE"
                                      role="tabpanel"
                                      aria-labelledby="v-pills-ABILENE-tab"
                                    >
                                      <p style={{fontSize:"12px"}}>
                                        {
                                          this.state.address[
                                            `${this.state.locationIndex}`
                                          ].street_address
                                        }
                                        {", "}
                                        <br/>
                                        {
                                          this.state.address[
                                            `${this.state.locationIndex}`
                                          ].city
                                        }
                                        {", "}
                                        {
                                          this.state.address[
                                            `${this.state.locationIndex}`
                                          ].state
                                        }
                                        {/* {", "} */}
                                        {" "}
                                        {
                                          this.state.address[
                                            `${this.state.locationIndex}`
                                          ].Zipcode
                                        }
                                        <br />
                                        <strong>Phone:</strong>
                                        <a
                                          href={`tel:${
                                            this.state.address[
                                              `${this.state.locationIndex}`
                                            ].HomePhone
                                          }`}
                                          style={{
                                            textDecoration: "none",
                                            color: "#434343",
                                          }}
                                        >
                                          {
                                            this.state.address[
                                              `${this.state.locationIndex}`
                                            ].HomePhone
                                          }
                                        </a>
                                        <br />
                                        <strong>Fax:</strong>
                                        <a
                                          href={`tel:${
                                            this.state.address[
                                              `${this.state.locationIndex}`
                                            ].fax
                                          }`}
                                          style={{
                                            textDecoration: "none",
                                            color: "#434343",
                                          }}
                                        >
                                          {
                                            this.state.address[
                                              `${this.state.locationIndex}`
                                            ].fax
                                          }
                                        </a>
                                        <br />
                                        {this.state.address[
                                          `${this.state.locationIndex}`
                                        ].fb_url && (
                                          <a
                                            href={`${
                                              this.state.address[
                                                `${this.state.locationIndex}`
                                              ].fb_url
                                            }`}
                                            target="_blank"
                                          >
                                            <BsFacebook
                                              size="22px"
                                              className="mr-1"
                                            />
                                          </a>
                                        )}
                                        |
                                        <a
                                          href={`mailto: ${
                                            this.state.address[
                                              `${this.state.locationIndex}`
                                            ].email
                                          }`}
                                          className="ml-1 mr-1"
                                        >
                                          <BsFillEnvelopeFill size="22px" />
                                        </a>
                                        <br />
                                        {this.state.address[
                                          `${this.state.locationIndex}`
                                        ].file_name && (
                                          <Button
                                            href={`${
                                              this.props.baseUrl
                                            }/documents/${
                                              this.state.address[
                                                `${this.state.locationIndex}`
                                              ].file_name
                                            }`}
                                            className="mt-1"
                                            target="_blank"
                                          >
                                            Referral Form
                                          </Button>
                                        )}
                                        <br />
                                      </p>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col">
                        <a href="#" className="link">
                          <i className="icon-clock" />
                          <span>Working Hours</span>
                        </a>
                        <div className="link-drop">
                          <h5 className="link-drop-title">
                            <i className="icon-clock" />
                            Working Time
                          </h5>
                          <table className="row-table">
                            <tbody>
                              <tr>
                                <td>
                                  <i>Mon-Thu</i>
                                </td>
                                <td>08:00 - 20:00</td>
                              </tr>
                              <tr>
                                <td>
                                  <i>Friday</i>
                                </td>
                                <td> 07:00 - 22:00</td>
                              </tr>
                              <tr>
                                <td>
                                  <i>Saturday</i>
                                </td>
                                <td>08:00 - 18:00</td>
                              </tr>
                              <tr>
                                <td>
                                  <i>Sunday</i>
                                </td>
                                <td>Closed</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col">
                        <a href="#" className="link">
                          <i className="icon-pencil-writing" />
                          <span>Referrral Form</span>
                        </a>
                      </div>
                      <div className="col">
                        <a href="#" className="link">
                          <i className="icon-calendar" />
                          <span>Locations schedule</span>
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Carousel
              activeIndex={this.state.activeIndex}
              next={this.next}
              previous={this.previous}
              interval={4000}
            >
              <CarouselIndicators
                items={this.state.items}
                activeIndex={this.state.activeIndex}
                onClickHandler={this.goToIndex}
              />
              {this.state.items.map((item, index) => (
                <CarouselItem
                  onExiting={() => this.setAnimating(true)}
                  onExited={() => this.setAnimating(false)}
                  key={`content-slide-${index}`}
                >
                  {item.html}
                </CarouselItem>
              ))}

              {/*<CarouselControl
                      direction="prev"
                      directionText="Previous"
                      onClickHandler={this.previous}
                    />
                    <CarouselControl
                      direction="next"
                      directionText="Next"
                      onClickHandler={this.next}
                    />*/}
            </Carousel>
          </div>
        </LoadingOverlay>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
  };
};
export default connect(mapStateToProps)(Slider);
