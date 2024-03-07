import React, { Component } from "react";
import LoadingOverlay from "react-loading-overlay";
import page from "../../../services/page";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Col,
  Row,
  Button,
  Table,
} from "reactstrap";

import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

class PageChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      loader: false,
      pages: [],
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      childModal: false,
      parentId: null,
    };
  }

  getPages = () => {
    this.setState({
      pages: this.props.pagesList,
      loader: false,
    });
  };

  componentDidMount() {
    this.setState({ loader: true });
    if (this.props.parentId) {
      this.getPages();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.parentId !== this.props.parentId) {
      this.getPages();
    }
  }

  deletePage = (id) => {
    let params = { id: id };
    if (window.confirm("Are you sure to delete this page?")) {
      page.delete(params).then((response) => {
        if (response.data.success) {
          let pages = this.state.pages;
          pages = this.state.pages.filter((page) => page.id !== id);
          this.setState({ pages });
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.error(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      });
    }
  };

  onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (destination.index == source.index) return;
    const t = this.state.pages.filter((ele) => ele.id == draggableId)[0];
    const newList = [...this.state.pages];
    newList.splice(source.index, 1);
    newList.splice(destination.index, 0, t);
    this.setState({ pages: newList });
    page
      .updateSequence({ pages: newList })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (res.data.error) {
          toast.error(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      })
      .catch((err) => {
        toast.error("Unexpected error !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  render() {
    return (
      <Modal isOpen={this.props.toggleData} size="lg">
        <ModalHeader toggle={() => this.props.toggleModalFunction(null)}>
          Sub page list
        </ModalHeader>
        <ModalBody style={{ minHeight: 250 }}>
          <CardBody style={{ minHeight: 400 }}>
            <LoadingOverlay
              active={this.state.loader}
              spinner={<Spinner color="dark" />}
              fadeSpeed={200}
              classNamePrefix="mitiz"
            >
              <Table hover>
                <thead>
                  <tr>
                    <th scope="col" className="border-top-0" width={7 + "%"}>
                      ID
                    </th>
                    <th scope="col" className="border-top-0">
                      Name
                    </th>
                    <th scope="col" className="border-top-0">
                      Url
                    </th>
                    <th
                      colSpan="2"
                      scope="col"
                      className="border-top-0"
                      width={10 + "%"}
                    ></th>
                  </tr>
                </thead>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="pageList">
                    {(provided) => (
                      <tbody
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {this.state.pages.length > 0 ? (
                          this.state.pages.map((page, index) => {
                            return (
                              <Draggable
                                draggableId={page.id}
                                index={index}
                                key={page.id}
                              >
                                {(provided) => (
                                  <tr
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    // key={`page-${index}`}
                                  >
                                    <td>{index + 1}</td>
                                    <td>{page.name}</td>
                                    <td>{page.url}</td>
                                    <td>
                                      <Link
                                        to={`/admin/front-end-settings/pages/add/${page.id}`}
                                        className="btn-sm btn btn-primary"
                                      >
                                        Edit
                                      </Link>
                                    </td>
                                    <td>
                                      <Button
                                        color="danger"
                                        className="btn-sm"
                                        onClick={() => this.deletePage(page.id)}
                                      >
                                        Delete
                                      </Button>
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            );
                          })
                        ) : (
                          <tr>
                            <td key={0} colSpan="5">
                              <p className="text-center">Page not found.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </Droppable>
                </DragDropContext>
              </Table>
            </LoadingOverlay>
          </CardBody>
        </ModalBody>
      </Modal>
    );
  }
}

export default PageChild;
