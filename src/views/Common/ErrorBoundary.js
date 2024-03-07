import React, { Component } from "react";
import Error from "./Error";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        };
    }
    /* static getDerivedStateFromError(error) {
        return {
            hasError: true
        }
    } */
    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.log(error);
        console.log(info);
    }
    render() {
        if (this.state.hasError) {
            return <Error />
        }
        return this.props.children;
    }
}

export default ErrorBoundary;