import React, { Component, Fragment } from "react";
import LoadingOverlay from "react-loading-overlay";

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
import page from "../../../services/page";
import Search from "../Search";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import PageChild from "./PageChild";
import Badge from "reactstrap/lib/Badge";

class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      loader: true,
      pages: [],
      dragablePages: [],
      search: false,
      searchFields: [{ label: "Name", name: "name", type: "text" }],
      error_403: false,
      sort: "",
      currentSortedColumn: null,
      childModal: false,
      parentId: null,
    };
  }
  getPages = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
    };

    page
      .list(params)
      .then((response) => {
        this.setState({ loader: false });
        let dragablePages = [];
        if (response.data.success) {
          response.data.contents.map((ele) => {
            if (ele.top_navigation === "1") {
              dragablePages.push(ele);
            }
          });

          this.setState({
            dragablePages: dragablePages,
            pages: response.data.contents,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  openChild = (id) => {
    this.setState({ parentId: id });
    this.toggleModal(id);
  };

  toggleModal = (id) => {
    this.setState((prevState) => ({
      childModal: !prevState.childModal,
    }));
  };
  toggleSearch = (e) => {
    this.setState((prevState) => ({
      search: !prevState.search,
    }));
  };

  clearSearch = () => {
    this.setState({ fields: {} }, () => {
      this.getPages(this.state.fields);
    });
  };

  componentDidMount = () => {
    this.getPages();
  };

  deletePage = (id, index) => {
    let params = { id: id };
    if (this.state.pages[index].children.length > 0) {
      if (
        window.confirm(
          "Deleting a main page will delete it's sub pages also, are you sure you want to proceed ?"
        )
      ) {
        this.pageDeleteFunc(params);
      }
    } else if (window.confirm("Are you sure to delete this page?")) {
      this.pageDeleteFunc(params);
    }
  };

  pageDeleteFunc = (params) => {
    page.delete(params).then((response) => {
      if (response.data.success) {
        let pages = this.state.pages;
        pages = this.state.pages.filter((page) => page.id !== params.id);
        // this.setState({ pages });
        this.getPages()
        toast.success(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    });
  };

  onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (destination.index == source.index) return;
    const t = this.state.pages.filter((ele) => ele.id == draggableId)[0];
    const newList = [...this.state.pages];
    newList.splice(source.index, 1);
    newList.splice(destination.index, 0, t);

    const td = this.state.dragablePages.filter(
      (ele) => ele.id == draggableId
    )[0];
    const newDragList = [...this.state.dragablePages];
    newDragList.splice(source.index, 1);
    newDragList.splice(destination.index, 0, td);
    this.setState({ pages: newList, dragablePages: newDragList });
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
      <Card className="shadow" outline color="dark">
        <CardHeader className="bg-default">
          <Row>
            <Col md={3} style={{ fontSize: 25 }}>
              Pages
            </Col>
            <Col md={9} className="text-right">
              <Button
                color="warning"
                type="button"
                onClick={this.toggleSearch}
                className="mr-2"
              >
                <FontAwesomeIcon icon="search" className="mr-1" />
                Search
              </Button>
              <Link
                to="/admin/front-end-settings/pages/add"
                className="btn btn-success"
              >
                Add New Page
              </Link>
            </Col>
          </Row>
          <Search
            fields={this.state.fields}
            isOpen={this.state.search}
            heading="Search pages"
            searchFields={this.state.searchFields}
            updateSearchFields={this.updateSearchFields}
            searchRecord={this.getPages}
            clearSearch={this.clearSearch}
          />
        </CardHeader>
        <CardBody style={{ minHeight: 400 }}>
          <LoadingOverlay
            active={this.state.loader}
            spinner={<Spinner color="dark" />}
            fadeSpeed={200}
            classNamePrefix="mitiz"
          >
            <Table responsive hover>
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
                  <th scope="col" className="border-top-0"></th>
                  <th scope="col" className="border-top-0">
                    Top Navigation
                  </th>
                  <th
                    colSpan="2"
                    scope="col"
                    className="border-top-0"
                    width={10 + "%"}
                  ></th>
                </tr>
              </thead>
              {this.state.pages.length > 0 ? (
                <>
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="pageList">
                      {(provided) => (
                        <tbody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {this.state.dragablePages.length > 0
                            ? this.state.dragablePages.map((page, index) => {
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
                                        {page.children.length > 0 ? (
                                          <Button
                                            color="link"
                                            className="btn"
                                            onClick={() =>
                                              this.openChild(page.id)
                                            }
                                          >
                                            Sub Pages
                                          </Button>
                                        ) : (
                                          <Button
                                            color="link"
                                            className="btn"
                                            disabled
                                            style={{ color: "black" }}
                                          >
                                            --
                                          </Button>
                                        )}
                                      </td>
                                      <td>
                                        {page.top_navigation === "1" ? (
                                          <Badge
                                            style={{
                                              width: "40px",
                                              height: "16px",
                                            }}
                                            color="success"
                                          >
                                            YES
                                          </Badge>
                                        ) : (
                                          <Badge
                                            style={{
                                              width: "40px",
                                              height: "16px",
                                            }}
                                            color="danger"
                                          >
                                            NO
                                          </Badge>
                                        )}
                                      </td>
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
                                          onClick={() =>
                                            this.deletePage(page.id, index)
                                          }
                                        >
                                          Delete
                                        </Button>
                                      </td>
                                    </tr>
                                  )}
                                </Draggable>
                              );
                            })
                            : null}
                          {provided.placeholder}
                        </tbody>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <tbody>
                    {this.state.pages.length > 0 &&
                      this.state.pages
                        .filter((ele) => ele.top_navigation === "0")
                        .map((page, index) => {
                          return (
                            <tr key={page.id}>
                              <td>
                                {index + 1 + this.state.dragablePages.length}
                              </td>
                              <td>{page.name}</td>
                              <td>{page.url}</td>
                              <td>
                                {page.children.length > 0 ? (
                                  <Button
                                    color="link"
                                    className="btn"
                                    onClick={() => this.openChild(page.id)}
                                  >
                                    Sub Pages
                                  </Button>
                                ) : (
                                  <Button
                                    color="link"
                                    className="btn"
                                    disabled
                                    style={{ color: "black" }}
                                  >
                                    --
                                  </Button>
                                )}
                              </td>
                              <td>
                                {page.top_navigation === "1" ? (
                                  <Badge
                                    style={{
                                      width: "40px",
                                      height: "16px",
                                    }}
                                    color="success"
                                  >
                                    YES
                                  </Badge>
                                ) : (
                                  <Badge
                                    style={{
                                      width: "40px",
                                      height: "16px",
                                    }}
                                    color="danger"
                                  >
                                    NO
                                  </Badge>
                                )}
                              </td>
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
                                  onClick={() =>
                                    this.deletePage(page.id, index)
                                  }
                                >
                                  Delete
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </>
              ) : (
                <tbody>
                  <tr>
                    <td key={0} colSpan="5">
                      <p className="text-center">Page not found.</p>
                    </td>
                  </tr>
                </tbody>
              )}
            </Table>
          </LoadingOverlay>
        </CardBody>
        {this.state.parentId && (
          <PageChild 
            toggleData={this.state.childModal}
            pagesList={
              this.state.pages.filter((ele) => ele.id == this.state.parentId)[0]
                .children
            }
            toggleModalFunction={this.toggleModal}
            parentId={this.state.parentId}
          />
        )}
      </Card>
    );
  }
}
export default Pages;
