import React, { Component } from "react";
import { connect } from "react-redux";
import common from "../../../services/common";
import ReactSummernote from "react-summernote";
import "react-summernote/dist/react-summernote.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingOverlay from "react-loading-overlay";
import { FormGroup, Spinner } from "reactstrap";

class ChooseSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloader: true,
            templates: [],
            summaryContent: "",
            selectedTemplate: ""
        };
    }
    chooseTemplate = (selectedTemplate) => {
        this.setState({ selectedTemplate, isloader: true });
        common.parepareSummary({ referral_id: this.props.referral.id, template_id: selectedTemplate }).then(response => {
            this.setState({ isloader: false });
            if (response.data.success) {
                this.setState({
                    summaryContent: response.data.template,
                });
                this.props.updateTreatmentSummary(response.data.template);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
    componentDidMount = () => {
        common.getTreatmentSummaryTemplates().then(response => {
            this.setState({ isloader: false });
            if (response.data.success) {
                this.setState({
                    templates: response.data.templates,
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
    handleTextArea = summaryContent => {
        this.setState({ summaryContent });
        this.props.updateTreatmentSummary(summaryContent);
    };
    render() {
        return (
            <LoadingOverlay
                active={this.state.isloader}
                spinner={<Spinner color="dark" />}
                fadeSpeed={200}
                classNamePrefix="mitiz"
            >
                <ul className="m-0 p-0 d-flex justify-content-center">
                    {this.state.templates.map(template => <li className={this.state.selectedTemplate === template.id ? 'd-inline-block m-3 text-center bg-blue' : 'd-inline-block m-3 text-center'} style={{ cursor: 'pointer', padding: `5px 22px` }} onClick={() => this.chooseTemplate(template.id)} key={`template-${template.id}`}>
                        <FontAwesomeIcon
                            icon="file-alt"
                            size="6x"
                        /><br />{template.name}</li>)}
                </ul>
                <FormGroup>
                    <ReactSummernote
                        options={{
                            height: 250,
                            dialogsInBody: true,
                            toolbar: [
                                ["style", ["style"]],
                                ["font", ["bold", "underline", "clear"]],
                                ["fontname", ["fontname"]],
                                ["para", ["ul", "ol", "paragraph"]],
                                ["table", ["table"]],
                                ["view", ["fullscreen", "codeview"]]
                            ]
                        }}
                        value={this.state.summaryContent}
                        onChange={this.handleTextArea}
                    />
                </FormGroup>
            </LoadingOverlay>

        );
    }
}
const mapStateToProps = state => {
    return {
        baseUrl: state.baseUrl,
        userId: state.userId,
    };
};
export default connect(mapStateToProps)(ChooseSummary);
