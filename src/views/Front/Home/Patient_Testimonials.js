import React, { Component } from 'react'

export default class Patient_Testimonials extends Component {
  render() {
    return (
      <div>
         <div className='patient_testimonials'>
             <div className='testimonials_details'>
               <div className='contents'>
                  <h5>What People Says</h5>
                  <h2>Patient <span>Testimonials</span></h2>
                  <p>I Am very impressed with you all as well as being highly proficient is absolutely adorable. I feel so relaxed in her capable hands and hope to be her patient for a very long time! You are a fantastic team and I feel very privileged to come to you all!!!</p>
                  <p> - Wilmer Stevenson, <i>Creative manager</i></p>
               </div>
             </div>
             <div className='testimonials_image'>
                <div className='testimonial_image_column'>
                  <img src='../../assets/images/testimonial1.jpg' alt=''/>
                  <img src='../../assets/images/testimonial2.jpg' alt=''/>
                  <img src='../../assets/images/testimonial3.jpg' alt=''/>
                  <img src='../../assets/images/testimonial4.jpg' alt=''/>
                </div>
                <div className='testimonial_image_column'>
                  <img src='../../assets/images/testimonial5.jpg' alt=''/>
                  <img src='../../assets/images/testimonial6.jpg' alt=''/>
                  <img src='../../assets/images/testimonial7.jpg' alt=''/>
                </div>
                <div className='testimonial_image_column'>
                  <img src='../../assets/images/testimonial8.jpg' alt=''/>
                  <img src='../../assets/images/testimonial9.jpg' alt=''/>
                </div>
             </div>
          </div>
      </div>
    )
  }
}
