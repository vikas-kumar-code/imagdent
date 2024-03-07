import React, { Component } from 'react'

export default class PatientTabNav extends Component {
  render() {
    return (
      <div>
          <ul className='nav custom_tabing'>
            {
              this.props.tabs.map(tab => {
                const active = (tab === this.props.selected ? 'active' : '');

                return (
                  <li className='nav-item' key={ tab }>
                    <a className={ 'nav-link ' + active } onClick={ () => this.props.setSelected(tab) }>
                      { tab }
                    </a>
                  </li>
                );
              })
            }
          </ul>
          { this.props.children }
      </div>
    )
  }
}
