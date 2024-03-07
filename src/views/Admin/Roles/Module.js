import React, { Component } from "react";
import { Card, CardHeader, CardBody, FormGroup, Label, Input, Spinner } from "reactstrap";
import role from "../../../services/role";

class Module extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loader: true,
            actions: []
        };
    }

    getActions = () => {
        role
            .getActions({ module_name: this.props.module.module_name })
            .then(response => {
                this.setState({ isloader: false });
                if (response.data.success) {
                    this.setState({
                        loader: false,
                        actions: response.data.actions,
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    componentDidMount = () => {
        this.getActions();
    };
    checkAction = (module_action, action) => {
        if (this.props.fields[module_action] !== undefined) {
            if (this.props.fields[module_action].indexOf(action) >= 0) {
                return true;
            }
        }
    };

    checkModule = (module_name) => {
        if (this.props.fields['module_name'] !== undefined) {
            if (this.props.fields['module_name'].indexOf(module_name) >= 0) {
                return true;
            }
        }
    };

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardHeader>
                        <FormGroup check inline>
                            <Label check>
                                <Input type="checkbox" onChange={event =>
                                    this.props.handleChange("module_name", event)
                                } value={`${this.props.module.module_name}~${this.props.module.id}`} checked={this.checkModule(`${this.props.module.module_name}~${this.props.module.id}`)} /> <strong>{this.props.module.module_name}</strong>
                            </Label>
                        </FormGroup>
                    </CardHeader>
                    <CardBody>
                        {this.state.loader && <div style={{ textAlign: "center" }}><Spinner color="dark" /></div>}
                        {this.state.actions.map(action =>
                            <FormGroup check inline key={`action-key-${action.id}`}>
                                <Label check>
                                    <Input type="checkbox" onChange={event =>
                                        this.props.handleChange(`module_action_${this.props.module.id}`, event)
                                    } value={action.action_name} checked={this.checkAction(`module_action_${this.props.module.id}`, action.action_name)} /> {action.action_label_name}
                                </Label>
                            </FormGroup>
                        )}
                    </CardBody>
                </Card>
            </React.Fragment >
        );
    }
}

export default Module;
