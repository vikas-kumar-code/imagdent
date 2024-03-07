import React, { Component } from "react";
import common from "../../../services/common";
import { connect } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";
import ReactToPrint from "react-to-print";
import moment from "moment";
class Activities extends Component {
  constructor(props) {
    super(props);
    this.state = { enablePrint: false };
  }
  /*componentDidUpdate = () => {
    //if(this.props.navigation)
    this.props.navigation.map(v => console.log(v.action_name));
  };*/
  render() {
    return (
      <div className="container py-2">
        {this.props.logs.length > 0 && (
          <React.Fragment>
            <div className="row">
              <div className="col text-right mb-1">
                <ReactToPrint
                  trigger={() => (
                    <button className="btn btn-primary">Print</button>
                  )}
                  content={() => this.componentRef}
                  pageStyle="m-10"
                />
              </div>
            </div>
            <Scrollbars style={{ minHeight: 500 }} autoHide={true}>
              <div ref={(el) => (this.componentRef = el)}>
                {this.props.logs.map((log, index) => (
                  <div className="row" key={`log-index-${index}`}>
                    <div className="col-auto text-center flex-column d-none d-sm-flex">
                      <div className="row h-50">
                        <div className={index > 0 ? `col border-right` : `col`}>
                          &nbsp;
                        </div>
                        <div className="col">&nbsp;</div>
                      </div>
                      <h5 className="m-2">
                        <span className="badge badge-pill bg-dark border">
                          &nbsp;
                        </span>
                      </h5>
                      <div className="row h-50">
                        <div
                          className={
                            index === Number(this.props.logs.length - 1)
                              ? `col`
                              : `col border-right`
                          }
                        >
                          &nbsp;
                        </div>
                        <div className="col">&nbsp;</div>
                      </div>
                    </div>
                    <div className="col py-2"style={{width:"276px"}}>
                      <div className="card shadow">
                        <div className="card-body">
                          <h4 className="card-title text-muted">{log.title}</h4>
                          <div
                              dangerouslySetInnerHTML={{
                                __html: log.message,
                              }}
                            />
                          <div>
                            <h5 className="float-left">
                              By {common.getFullName(log.addedby)}
                            </h5>
                            <div className="float-right text-muted">
                              {moment(log.added_on).format("LLL")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Scrollbars>
          </React.Fragment>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    navigation: state.navigation,
  };
};
export default connect(mapStateToProps)(Activities);
