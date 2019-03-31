import React from 'react'
import { connect } from 'react-redux'
import './providerlist.scss'
import ProviderListItem from '../components/ProviderListItem'

class ProviderList extends React.Component {
  constructor () {
    super()
    this.state = {
      providers: [{
        name: 'Gmail',
        icon: 'gmail'
      }, {
        name: 'Outlook',
        icon: 'outlook'
      }]
    }
    this.getProviders = this.getProviders.bind(this)
  }
  getProviders (boxes) {
    return boxes.map((b, i) => {
      return <ProviderListItem key={b.id || i} {...b} />
    })
  }
  render () {
    return <div className='provider-list flex-container flex-center'>
      <div className='providers'>
        {this.getProviders(this.state.providers)}
      </div>
    </div>
  }
}

export default ProviderList
