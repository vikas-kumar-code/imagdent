import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, Card, CardHeader, CardBody } from "reactstrap";
import Contact from "./Contact";
import ViewContact from "./ViewContact";

class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      contactDetail: {}
    };
  }
  toggleSubModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  };
  showContact = e => {
    let contactDetail = this.props.contacts.filter(
      c => c.id == e.target.dataset.id
    );

    this.setState({ contactDetail });
    this.toggleSubModal();
  };

  render() {
    const { contacts } = this.props;
    return (
      <Card>
        <CardHeader>
          <strong>{this.props.title}</strong>
        </CardHeader>
        <CardBody>
          <Table responsive className="table-striped">
            <thead>
              <tr>
                <th scope="col" className="border-top-0" width={7 + "%"} />

                <th scope="col" className="border-top-0">
                  Name
                </th>
                <th scope="col" className="border-top-0">
                  Role
                </th>
                {this.props.addedOn && (
                  <React.Fragment>
                    <th scope="col" className="border-top-0">
                      Phone
                    </th>
                    <th scope="col" className="border-top-0">
                      Added On
                    </th>
                  </React.Fragment>
                )}
                {this.props.enableEdit && (
                  <th scope="col" colSpan="2" className="border-top-0" />
                )}
              </tr>
            </thead>
            <tbody>
              {contacts && contacts.length > 0
                ? contacts.map((contact, index) => (
                    <Contact
                      contact={contact}
                      removeContact={this.props.removeContact}
                      enableDelete={this.props.enableDelete}
                      enableEdit={this.props.enableEdit}
                      addedOn={this.props.addedOn}
                      addedBy={this.props.addedBy}
                      showContact={this.showContact}
                      key={`contact-key-${index}`}
                      index={index}
                      fillContact={this.props.fillContact}
                    />
                  ))
                : !this.state.isloader && (
                    <tr>
                      <td key={0} colSpan="7">
                        <p className="text-center">No Contact found.</p>
                      </td>
                    </tr>
                  )}
            </tbody>
          </Table>
        </CardBody>
        {this.state.showModal && (
          <ViewContact
            showModal={this.state.showModal}
            toggleSubModal={this.toggleSubModal}
            contactDetail={this.state.contactDetail}
          />
        )}
      </Card>
    );
  }
}

export default Contacts;
