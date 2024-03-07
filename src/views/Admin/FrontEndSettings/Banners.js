import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import setting from "../../../services/setting";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
  Button,
  CardFooter,
} from "reactstrap";
import AddEditBanner from "./AddEditBanner";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc";

const SortableItem = SortableElement(
  ({ value, baseUrl, toggleModal, deleteBanner }) => (
    <Col md={6}>
      <Card>
        <CardBody className="p-0">
          <img
            src={`${baseUrl}/images/${value.file_name}`}
            style={{ width: "100%" }}
          />
        </CardBody>
        <CardFooter>
          <Row>
            <Col md={6}>
              <Button
                color="primary"
                className="btn-sm"
                onClick={(e) => toggleModal(e)}
                data-id={value.id}
              >
                Edit
              </Button>
            </Col>
            <Col md={6} className="text-right">
              <Button
                color="danger"
                className="btn-sm"
                onClick={() => deleteBanner(value.id)}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    </Col>
  )
);

const SortableList = SortableContainer(
  ({ items, baseUrl, toggleModal, deleteBanner }) => {
    return (
      <Row>
        {items.map((value, index) => (
          <SortableItem
            axis="xy"
            key={`item-${value.id}`}
            index={index}
            value={value}
            baseUrl={baseUrl}
            toggleModal={toggleModal}
            deleteBanner={deleteBanner}
          />
        ))}
      </Row>
    );
  }
);

class Banners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      showModal: false,
      banners: [],
    };
  }

  toggleModal = (e) => {
    let bannerId = e !== undefined ? e.target.dataset.id : "";
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
      bannerId,
    }));
  };
  getBanners = () => {
    this.setState({ isloader: true });
    let params = {};
    setting
      .listBanners(params)
      .then((response) => {
        this.setState({ loader: false });
        if (response.data.success) {
          this.setState({
            banners: response.data.banners,
          });
        }
      })
      .catch((error) => {
        this.setState({ error_403: true });
      });
  };

  deleteBanner = (id) => {
    if (window.confirm("Are you sure to delete this Banner?")) {
      setting.deleteBanner({ id }).then((res) => {
        if (res.data.success) {
          let newBanner = [];
          newBanner = this.state.banners.filter((ele) => ele.id !== id);
          this.setState({ banners: newBanner });
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (res.data.error) {
          toast.error(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ banners }) => ({
      banners: arrayMove(banners, oldIndex, newIndex),
    }));
    setting.updateSequence({ banners: this.state.banners }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (res.data.error) {
        toast.error(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  componentDidMount = () => {
    this.getBanners();
  };
  render() {
    return (
      <Card className="shadow" outline color="dark">
        <CardHeader className="bg-default">
          <Row>
            <Col md={3} style={{ fontSize: 25 }}>
              Banner
            </Col>
            <Col md={9} className="text-right">
              <Button color="success" onClick={this.toggleModal}>
                Add New Banner
              </Button>
            </Col>
          </Row>
        </CardHeader>
        <CardBody style={{ minHeight: 400 }}>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            {this.state.banners.length > 0 ? (
              <SortableList
                items={this.state.banners}
                onSortEnd={this.onSortEnd}
                baseUrl={this.props.baseUrl}
                toggleModal={this.toggleModal}
                deleteBanner={this.deleteBanner}
                axis={"xy"}
              />
            ) : (
              <Col md={12}>
                <p className="text-center text-danger">
                  No banner image found!
                </p>
              </Col>
            )}
          </LoadingOverlay>
        </CardBody>
        {this.state.showModal && (
          <AddEditBanner
            showModal={this.state.showModal}
            toggleModal={this.toggleModal}
            bannerId={this.state.bannerId}
            getBanners={this.getBanners}
          />
        )}
      </Card>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    baseUrl: state.baseUrl,
    apiUrl: state.apiUrl,
  };
};
export default connect(mapStateToProps)(Banners);
