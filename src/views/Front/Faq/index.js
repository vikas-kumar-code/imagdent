import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Collapse, CardHeader, CardBody, Card, Container } from "reactstrap";
import page from "../../../services/page";

class Faq extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: 0,
      faqs: [],
      cards: [],
    
    };
  }
  toggle(e) {
    let event = e.target.dataset.event;
    this.setState({
      collapse: this.state.collapse === Number(event) ? 0 : Number(event),
    });
  }
  getFaq = (fields) => {
    this.setState({ isloader: true });
    let params = {
      fields: fields,
    };

    page
      .listFaq(params)
      .then((response) => {
        this.setState({ loader: false });
        if (response.data.success) {
          this.setState({
            faqs: response.data.faqs,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getFaq();
  };
  render() {
    const { cards, collapse } = this.state;
    return (
      <React.Fragment>
        <Helmet>
          <title>FAQ - iMagDent</title>
        </Helmet>
        <div className="page-content">
          <div className="section mt-0">
            <div className="breadcrumbs-wrap">
              <div className="container">
                <div className="breadcrumbs">
                  <Link to="/">Home</Link>
                  <span>FAQ</span>
                </div>
              </div>
            </div>
          </div>
          <div className="container" style={{minHeight:650}}>
          <h1>Frequently Asked Questions</h1>
            <div className="h-decor" />
            <div style={{ margin: "3rem 0" }}>
              <div className="custom_accordian">
                {this.state.faqs.length > 0 &&
                  this.state.faqs.map((v, index) => {
                    return (
                      <Container>
                        <Card style={{ marginBottom: "5px" }} key={index}>
                          <CardHeader
                            onClick={this.toggle}
                            data-event={index}
                            style={{}}
                          >
                            <span>{index + 1}.</span> {v.question}{" "}
                            <img
                              src="../../assets/images/arrow-down.png"
                              className="float-right"
                            />
                          </CardHeader>
                          <Collapse
                            isOpen={collapse === index}
                            style={{ backgroundColor: "#f6f7f9" }}
                          >
                            <CardBody>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: v.answer,
                                }}
                              />
                            </CardBody>
                          </Collapse>
                        </Card>
                      </Container>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userType: state.userType,
  };
};
export default connect(mapStateToProps)(Faq);
