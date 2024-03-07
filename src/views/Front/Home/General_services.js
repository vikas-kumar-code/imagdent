import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class General_services extends Component {
  render() {
    return (
      <div>
        <div className="general_services">
          <h5>What we offer</h5>
          <h2>General Services</h2>
          <hr />
          <div className="services">
            <div className="services_boxes">
              <div className="services_boxes_details">
                <i class="icon-icon-orthodontics" />
                <h3>ORTHODONTIC SERVICES</h3>
                <p>The Future of Ortho is Here!</p>
              </div>
            </div>
            <div className="services_boxes">

                <div className="services_boxes_details cbct_services">
                  <div className="row">
                    <div className="col-sm-6">
                      <img
                        src="../../assets/images/cbct-machine.png"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-sm-6 ">
                     <div className="service_boxes_lg">
                      <div className="services_boxes_details">
                        <h3>CBCT SERVICES</h3>
                        <p>3D Images at your Fingertips</p>
                        <Link to="">
                          Know more
                          <i class="icon-right-arrow"></i>
                        </Link>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>

            </div>
          </div>
          <div className="services services_2">
            <div className="services_boxes virtual_implant">

              <div className="services_boxes_details">
                <div className="row">
                  <div className="col-sm-6">
                   <div className="service_boxes_lg">
                    <img
                      src="../../assets/images/IMPLANT.png"
                      alt=""
                      className="img-fluid"
                    />
                    </div>
                  </div>
                  <div className="col-sm-6 ">
                   <div className="service_boxes_lg">
                    <div className="services_boxes_details">
                      <h3>VIRTUAL IMPLANT PLANNING</h3>
                      <p>No Software, No Problem!</p>
                      <Link to="">
                        Know more
                        <i class="icon-right-arrow"></i>
                      </Link>
                    </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            <div className="services_boxes">
              <div className="services_boxes_details">
                <h3>VIRTUAL IMPLANT PLANNING</h3>
                <p>No Software, No Problem!</p>
                <Link to="">
                  Know more
                  <i class="icon-right-arrow"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* <div className='row'>
               <div className='col-sm-4'>
                 <div className='services_boxes'>
                   <div className='services_boxes_details'>
                    <i class="icon-icon-orthodontics" />
                    <h3>ORTHODONTIC SERVICES</h3>
                    <p>The Future of Ortho is Here!</p>
                   </div>
                 </div>
               </div>
               <div className='col-sm-8'>
                 <div className='services_boxes'>
                   <div className='services_boxes_details cbct_services'>
                    <div className='row'>
                      <div className='col-sm-6'>
                          <img
                            src='../../assets/images/cbct-machine.png'
                            alt=""
                            className="img-fluid"
                          />
                      </div>
                      <div className='col-sm-6 '>
                        <div className='services_boxes_details'>
                          <h3>CBCT SERVICES</h3>
                          <p>3D Images at your Fingertips</p>
                          <Link to=''>
                            Know more
                            <i class="icon-right-arrow"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                   </div>
                 </div>
               </div>
             </div> */}

          {/* <div className='row'>
               <div className='col-sm-8'>
                 <div className='services_boxes virtual_implant'>
                   <div className='services_boxes_details'>
                    <div className='row'>
                      <div className='col-sm-6'>
                          <img
                            src='../../assets/images/IMPLANT.png'
                            alt=""
                            className="img-fluid"
                          />
                      </div>
                      <div className='col-sm-6 '>
                        <div className='services_boxes_details'>
                          <h3>VIRTUAL IMPLANT PLANNING</h3>
                          <p>No Software, No Problem!</p>
                          <Link to=''>
                            Know more
                            <i class="icon-right-arrow"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                   </div>
                 </div>
               </div>
               <div className='col-sm-4'>
                 <div className='services_boxes'>
                   <div className='services_boxes_details'>
                    <i class="icon-emergency" />
                    <h3>DENTAL EMERGENCY</h3>
                    <p>Helping thousand of people each year find immediate dental services</p>
                   </div>
                 </div>
               </div>
             </div> */}
        </div>
      </div>
    );
  }
}
