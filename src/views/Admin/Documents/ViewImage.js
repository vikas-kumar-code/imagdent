import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";

class ViewImage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Modal isOpen={this.props.showModal} size="lg">
                <ModalHeader toggle={this.props.toggleSubModal}>Document Preview
          </ModalHeader>
                <ModalBody>
                    <img src={this.props.imageSource} style={{ width: '100%' }} />
                </ModalBody>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        baseUrl: state.baseUrl
    };
};
export default connect(mapStateToProps)(ViewImage);
