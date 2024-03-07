import React, { Component } from 'react'

export default class Contact extends Component {
  render() {
    return (
      <div>
        <div className='contact'>
           <div className='container'>
             <div className='row'>
               <div className='col-sm-3'>
                 <img src='../../assets/images/Emergency.jpg' alt=''/>
                 <h5>Emergency Phone</h5>
                 <p>415-205-5550<br/>Call us Anytime 24/7</p>
               </div>
               <div className='col-sm-3'>
                 <img src='../../assets/images/Address.jpg' alt=''/>
                 <h5>Address</h5>
                 <p>500 Linden Ave, South San Francisco,</p>
               </div>
               <div className='col-sm-3'>
                 <img src='../../assets/images/Book_Phone.jpg' alt=''/>
                 <h5>Book By Phone</h5>
                 <p>415-205-5550<br/>405-222-5551</p>
               </div>
               <div className='col-sm-3'>
                 <img src='../../assets/images/Email.jpg' alt=''/>
                 <h5>Email Us</h5>
                 <p>office@denticare.com<br/>emergencies@denticare.com</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    )
  }
}
