import moment from "moment";
import React, { Component, Fragment } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
    Container,
    Table,
} from "reactstrap";
import common from "../../../../services/common";
import report from "../../../../services/report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import invoicelogo from "../../../../assets/images/front-logo.png"


class InvoiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            isloader: true,
            fields: this.props.fields,
            users: []
        }
    }
    getInvoice = (fields) => {
        this.setState({ loader: true });
        let params = {
            fields: fields,
            export: this.state.export,
            format: this.state.format,
        };
        report
            .invoice(params)
            .then((response) => {
                this.setState({ loader: false });
                if (response && params.export === true) {
                    let arrBuffer = this.base64ToArrayBuffer(response.data);
                    let fname = "";
                    let disposition = response.headers["content-disposition"];
                    if (disposition) {
                        let filenameRegex = /fname[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        let matches = filenameRegex.exec(disposition);
                        if (matches !== null && matches[1])
                            fname = matches[1].replace(/['"]/g, "");
                    }
                    try {
                        let blob = new Blob([arrBuffer], { type: "application/pdf" });
                        console.log(blob);
                        if (typeof window.navigator.msSaveBlob !== "undefined") {
                            window.navigator.msSaveBlob(blob, fname);
                        } else {
                            let URL = window.URL || window.webkitURL;
                            let downloadUrl = URL.createObjectURL(blob);
                            let a = document.createElement("a");
                            a.href = downloadUrl;
                            a.download = "doctor-ar-invoice.pdf";
                            document.body.append(a);
                            a.click();
                            a.remove();
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else if (response.data.success) {
                    this.setState({
                        arPaymentsTotal: response.data.arPaymentsCollectedTotal,
                        users: response.data.users,
                        loader: false,
                        isloader: false
                    });
                }
            })
            .catch((error) => {
                //this.setState({ error_403: true });
            });
    };
    componentDidMount = () => {
        this.getInvoice(this.state.fields);
    };
    exportRecord = (format) => {
        this.setState({ export: true, format }, () => {
            this.getInvoice(this.state.fields);
            this.setState({ export: false });
        });
    };
    base64ToArrayBuffer(data) {
        var binaryString = window.atob(data);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    calculateGrandTotal = (invoices) => {
        let amountPaid = [];
        invoices.forEach((payment, index) => {
            if (payment.case.status == 8) {
                amountPaid[index] = parseFloat(payment.sub_total);
            }
        });
        let totalAmount = 0.0;
        if (amountPaid.length > 0) {
            totalAmount = amountPaid.reduce((sum, amount) => {
                return amount + sum;
            });
        }
        return totalAmount.toFixed(2);
    };

    render() {
        return (
            <Modal isOpen={this.props.showModal} size="lg" style={{ maxWidth: '1000px', width: '100%' }}>
                <ModalHeader toggle={this.props.toggleModal}>
                    <Button color="success" onClick={() => this.exportRecord("pdf")}
                        disabled={this.state.loader}
                    >
                        <FontAwesomeIcon
                            icon={this.state.loader ? "spinner" : "download"}
                            className="mr-1"
                            spin={this.state.loader ? true : false}
                        />
                        Download
                    </Button>
                </ModalHeader>
                <ModalBody>
                    {
                        this.state.isloader ?
                            (<div className="text-center p-5"><Spinner color="dark" /></div>) : (
                                <Container>
                                    {this.state.users.length > 0 &&
                                        this.state.users.map((ele, i) => (
                                            <div key={i}>
                                                <table width="100%" style={{ tableLayout: "fixed" }}>
                                                    <tr>
                                                        <td className="text-dark" valign="top">
                                                            <tr>
                                                                <td valign="top">
                                                                        <img src={invoicelogo} width="110px"/> <br/>
                                                                    <strong>                                                                    
                                                                        12223 West Giles Rd.
                                                                        <br />
                                                                        La Vista, NE 68128
                                                                    </strong>
                                                                </td>
                                                            </tr>
                                                            <tr style={{ height: "185px" }}>
                                                                <td valign="bottom">

                                                                    <strong>
                                                                        {common.getFullName(ele)} <br />
                                                                        {ele.b_street}
                                                                        <br />
                                                                        {ele.b_city != null && `${ele.b_city}`}
                                                                        {ele.bstate != null && `, ${ele.bstate.state_code} `}
                                                                        {ele.b_zipcode != null && ` ${ele.b_zipcode}`}
                                                                    </strong>
                                                                </td>
                                                            </tr>

                                                        </td>
                                                        <td className="text-dark">
                                                            <table width="100%">
                                                                <tr>
                                                                    <td align="right"><strong>Statement Date: </strong></td>
                                                                    <td>{moment().format("MM-DD-YYYY") + " "}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="right"><strong>Account Number: </strong></td>
                                                                    <td>{ele.id}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="right"><strong>Statement Total: </strong></td>
                                                                    <td>${common.numberFormat(
                                                                        this.calculateGrandTotal(ele.invoices)
                                                                    )}</td>
                                                                </tr>
                                                                <tr><td height="20"></td></tr>
                                                                <tr>


                                                                    <td align="right"><strong>Amount Enclosed: </strong> </td>
                                                                    <td style={{ borderBottom: "1px solid black" }}></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="right"><strong>Type of Card: </strong> </td>
                                                                    <td style={{ borderBottom: "1px solid black" }}>
                                                                        <table width={`100%`}>
                                                                            <tr>
                                                                                <td> Visa </td>
                                                                                <td >MasterCard</td>
                                                                                <td >Amex</td>
                                                                                <td >Discover</td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td align="right"><strong>Name on Card: </strong></td>
                                                                    <td style={{ borderBottom: "1px solid black" }}></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="right"><strong>Card Number: </strong></td>
                                                                    <td style={{ borderBottom: "1px solid black" }}></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="right"><strong>Expiration Date: </strong></td>
                                                                    <td style={{ borderBottom: "1px solid black" }}></td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="right"><strong>Security Code : </strong></td>
                                                                    <td>
                                                                        <table width="100%">
                                                                            <tr>
                                                                                <td style={{ borderBottom: "1px solid black" }} width="40%"></td>

                                                                                <td>
                                                                                    <strong> Zipcode: </strong>
                                                                                </td>
                                                                                <td width="40%" style={{ borderBottom: "1px solid black" }}></td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="right"><strong>Signature: </strong></td>
                                                                    <td style={{ borderBottom: "1px solid black" }}></td>
                                                                </tr>

                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <br />
                                                <Table responsive>
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" style={{ width: "6%" }}>
                                                                Date
                                                            </th>
                                                            <th scope="col" style={{ width: "16%" }}>
                                                                Invoice No.
                                                            </th>
                                                            <th scope="col" style={{ width: "20%" }}>
                                                                Patient
                                                            </th>

                                                            <th scope="col" style={{ width: "19%" }}>
                                                                Imaging Location
                                                            </th>
                                                            <th scope="col" style={{ width: "7%" }}>
                                                                Subtotal
                                                            </th>
                                                            <th scope="col" style={{ width: "10%" }}>
                                                                Adjustments
                                                            </th>
                                                            <th scope="col" style={{ width: "12%" }}>
                                                                Invoice Total
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {ele.invoices.map((e, i) => (
                                                            <Fragment>
                                                                {
                                                                    e.case.status == 8 && (
                                                                        <Fragment key={i}>

                                                                            <tr  style={{background:`#cccccc`}}>
                                                                                <td
                                                                                    style={{ borderTop: `3px solid`, width: "20%" }}>
                                                                                    {e.case.patient_checked_in !== null
                                                                                        ? moment(e.case.patient_checked_in).format(
                                                                                            "MM-DD-YYYY"
                                                                                        )
                                                                                        : "--"}
                                                                                </td>
                                                                                <td style={{ borderTop: `3px solid` }}>
                                                                                    {e.invoice_id}
                                                                                </td>
                                                                                <td style={{ borderTop: `3px solid` }}>
                                                                                    {e.case.patient.last_name},{" "}
                                                                                    {e.case.patient.first_name}
                                                                                </td>

                                                                                <td style={{ borderTop: `3px solid` }}>
                                                                                    {e.case.location.publish_name}
                                                                                </td>
                                                                                <td style={{ borderTop: `3px solid` }}>
                                                                                    ${e.amount !== null && e.amount}
                                                                                </td>
                                                                                <td style={{ borderTop: `3px solid` }}>
                                                                                    {e.discount !== null && e.discount > 0
                                                                                        ? `-$${e.discount}`
                                                                                        : "$0.00"}
                                                                                </td>
                                                                                <td style={{ borderTop: `3px solid` }}>
                                                                                    ${e.sub_total}
                                                                                </td>
                                                                            </tr>

                                                                            <tr>
                                                                                <td colspan={2}></td>
                                                                                <td colspan={2} align="left">
                                                                                    <strong>Procedure</strong>
                                                                                </td>
                                                                                <td align="left">
                                                                                    <strong>Fee</strong>
                                                                                </td>
                                                                                <td>
                                                                                    <strong>Adjustments</strong>
                                                                                </td>
                                                                                <td></td>

                                                                            </tr>
                                                                            {e.case.services.map((cs, i) => (
                                                                                <tr key={i}>
                                                                                    <td colspan={2}></td>
                                                                                    <td
                                                                                        colspan={2}
                                                                                        align="left">
                                                                                        {cs.service !== null ? cs.service.name : "--"}
                                                                                    </td>
                                                                                    <td align="left">
                                                                                        $
                                                                                        {cs.sub_total !== null
                                                                                            ? common.numberFormat(cs.sub_total)
                                                                                            : "0"}
                                                                                    </td>
                                                                                    <td>
                                                                                        {cs.discount !== null && e.discount > 0
                                                                                            ? `  -$${cs.discount}`
                                                                                            : "$0.00"}
                                                                                    </td>
                                                                                    <td></td>

                                                                                </tr>
                                                                            ))}
                                                                        </Fragment>
                                                                    )
                                                                }
                                                            </Fragment>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ))}
                                </Container>
                            )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default InvoiceModal;
