import React, { Component } from "react";
import { Collapse, CardHeader, CardBody, Card } from "reactstrap";
import { Scrollbars } from 'react-custom-scrollbars';

class PatientInformation extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapse: 0,
      cards: [
        {
          header: (
            <React.Fragment>
              How often should I visit my dentist?
            </React.Fragment>
          ),
          body: (
            <React.Fragment>
              Everyone’s needs are different, so have a chat to your dentist
              about how often you need to have your teeth checked by them based
              on the condition of your mouth, teeth and gums. It’s recommended
              that children see their dentist at least once a year.
            </React.Fragment>
          )
        },
        {
          header: (
            <React.Fragment>
              Why are regular dental assessments so important?
            </React.Fragment>
          ),
          body: (
            <React.Fragment>
              Everyone’s needs are different, so have a chat to your dentist
              about how often you need to have your teeth checked by them based
              on the condition of your mouth, teeth and gums. It’s recommended
              that children see their dentist at least once a year.
            </React.Fragment>
          )
        },
        {
          header: (
            <React.Fragment>
              How do I know if my teeth are healthy?
            </React.Fragment>
          ),
          body: (
            <React.Fragment>
              Everyone’s needs are different, so have a chat to your dentist
              about how often you need to have your teeth checked by them based
              on the condition of your mouth, teeth and gums. It’s recommended
              that children see their dentist at least once a year.
            </React.Fragment>
          )
        },
        {
          header: (
            <React.Fragment>How can I improve my oral hygiene?</React.Fragment>
          ),
          body: (
            <React.Fragment>
              Everyone’s needs are different, so have a chat to your dentist
              about how often you need to have your teeth checked by them based
              on the condition of your mouth, teeth and gums. It’s recommended
              that children see their dentist at least once a year.
            </React.Fragment>
          )
        }
      ]
    };
  }
  toggle(e) {
    let event = e.target.dataset.event;
    this.setState({
      collapse: this.state.collapse === Number(event) ? 0 : Number(event)
    });
  }
  render() {
    const { cards, collapse } = this.state;
    return (
      <Scrollbars style={{ minHeight: 370 }} autoHide={true}>
        <div className="custom_accordian">
          {cards.map((v, index) => {
            return (
              <Card style={{ marginBottom: "1rem" }} key={index}>
                <CardHeader
                  onClick={this.toggle}
                  data-event={index}
                  style={{ }}
                >
                  <span>{index + 1}.</span> {v.header} <img src='../../assets/images/arrow-down.png'/>
                </CardHeader>
                <Collapse
                  isOpen={collapse === index}
                  style={{ backgroundColor: "#f6f7f9" }}
                >
                  <CardBody>{v.body}</CardBody>
                </Collapse>
              </Card>
            );
          })}
        </div>
      </Scrollbars>
    );
  }
}
export default PatientInformation;
