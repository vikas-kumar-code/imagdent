import React, { Component } from 'react';
import PatientTabNav from './PatientTabNav';
import PatientTab from './PatientTab';
import PatientInformation from './PatientInformation';

export default class Patient_Information extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 'General'
    }
  }

  setSelected = (tab) => {
    this.setState({ selected: tab });
  }
  render() {
    return (
      <div>
        <div className='patient_information'>
             <div className='patient_information_details'>
                <img src='../../assets/images/banner-left.jpg' alt=''/>
             </div>
             <div className='patient_information_details'>
               <div className='patient_information_content'>
                <h2>Patient <span>Information</span></h2>
                  <PatientTabNav tabs={['General', 'Urgent']} selected={ this.state.selected } setSelected={ this.setSelected }>
                      <PatientTab isSelected={ this.state.selected === 'General' }>
                        <PatientInformation/>
                      </PatientTab>
                      <PatientTab isSelected={ this.state.selected === 'Urgent' }>
                        <p>settings</p>
                      </PatientTab>
                  </PatientTabNav>

               </div>
             </div>
          </div>
      </div>
    )
  }
}
