import React, { Component } from 'react'

export default class Choose_us extends Component {
  render() {
    return (
      <div>
        <div className='choose_us'>
            <div className='container'>
              <h5>See the difference</h5>
              <h2>Why Choose Us?</h2>
              <hr/>
              <div className='row'>
                <div className='col-sm-4'>
                  <div className='choose_us_details'>
                      <div className="icn-text-circle">
                        <i class="icon-emergency-call" />
                      </div>
                      <h4>ONLINE SCHEDULING</h4>
                      <p>We provide comprehensive treatment planning and follow strict standards that ensure your surgery will go smoothly and provide the results you desire.</p>
                  </div>
                </div>
                <div className='col-sm-4'>
                  <div className='choose_us_details'>
                      <div className="icn-text-circle">
                        <i class="icon-clock" />
                      </div>
                      <h4>SAME DAY APPOINTMENTS</h4>
                      <p>Our administrative and clinical team is second to none. They are experienced, highly trained, friendly, and intuitive regarding your needs and will make your visits run effectively.</p>
                  </div>
                </div>
                <div className='col-sm-4'>
                  <div className='choose_us_details'>
                      <div className="icn-text-circle">
                        <i class="icon-health-care" />
                      </div>
                      <h4>24/7 ACCESS</h4>
                      <p>We provide comprehensive treatment planning and follow strict standards that ensure your surgery will go smoothly and provide the results you desire.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}
