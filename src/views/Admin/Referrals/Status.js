import React, { Component } from "react";
import { Progress } from "reactstrap";
import { connect } from "react-redux";

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    render() {
        const record = this.props.referral;
        return (
            <Progress multi>
                <Progress bar value="20" color={record.status >= 5 ? "success" : "gray-300"}>Patient Info. Received</Progress>
                <Progress bar value="30" color={record.status >= 6 ? "success" : "gray-300"}>Consultation</Progress>
                <Progress bar value="30" color={record.status >= 7 ? "success" : "gray-300"}>Procedure</Progress>
                <Progress bar value="20" color={record.status >= 8 ? "success" : "gray-300"}>Patient Therapy Completed</Progress>
            </Progress>
        );
    }
}
const mapStateToProps = state => {
    return {
        baseUrl: state.baseUrl,
        userId: state.userId,
    };
};
export default connect(mapStateToProps)(Status);
