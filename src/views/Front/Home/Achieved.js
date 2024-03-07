import React, { Component } from 'react'

export default class Achieved extends Component {
  render() {
    return (
      <div>
         <div className='achieved'>
            <div className='container'>
              <h5>Clinic Figures</h5>
              <h2>What Have We Achieved</h2>
              <hr/>
              <div className='row'>
                <div className='col-sm-3'>
                  <div className='achieved_box'>
                      <i class="icon-hand"></i>
                      <h4>15+</h4>
                      <hr/>
                      <p>Years of experience</p>
                  </div>
                </div>
                <div className='col-sm-3'>
                  <div className='achieved_box'>
                      <i class="icon-tooth-1"></i>
                      <h4>10+</h4>
                      <hr/>
                      <p>Improved Smiles</p>
                  </div>
                </div>
                <div className='col-sm-3'>
                  <div className='achieved_box'>
                      <i class="icon-team"></i>
                      <h4>50</h4>
                      <hr/>
                      <p>Dentisitry Specialists</p>
                  </div>
                </div>
                <div className='col-sm-3'>
                  <div className='achieved_box'>
                      <i class="icon-placeholder3"></i>
                      <h4>4+</h4>
                      <hr/>
                      <p>Our Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}
