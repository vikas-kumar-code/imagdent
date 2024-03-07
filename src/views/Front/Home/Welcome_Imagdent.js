import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Welcome_Imagdent extends Component {
  render() {
    return (
      <div>
          <div className='welcome_imagdent'>
             <div className='container'>
                <div className='row'>
                   <div className='col-sm-6'>
                     <div className='welcome_imagdent_details'>
                      <h4>15 Years of Dental Excellence</h4>
                      <h2>Welcome to <span>iMagDent</span></h2>
                      <p>iMagDent offers a full range of CBCT digital imaging services to complement
                          and streamline the modern dental practice. Contact us to learn how iMagDent
                          can improve your clinical performance today!</p>
                       <Link to='/'>
                         Booking a visit
                         <i className="icon-right-arrow"/>
                       </Link>
                      </div>
                   </div>
                   <div className='col-sm-6'>
                     <div className='embed_iframe'>
                        <iframe
                          src="https://www.youtube.com/embed/IVqKLxp6R4U"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                     </div>
                   </div>
                </div>
             </div>
          </div>
      </div>
    )
  }
}
