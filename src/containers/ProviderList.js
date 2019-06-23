import React from 'react'
import { connect } from 'react-redux'
import './providerlist.scss'
import ProviderListItem from '../components/ProviderListItem'

class ProviderList extends React.Component {
  constructor () {
    super()
    this.getProviders = this.getProviders.bind(this)
  }
  getProviders (boxes) {
    return boxes ? boxes.map((b, i) => {
      return <ProviderListItem key={b.id || i} {...b} />
    }) : []
  }
  render () {
    return <div className='provider-list flex-container flex-center'>
      <div className='providers'>
        {this.getProviders(this.props.providers)}
      </div>
    </div>
  }
}

const mapStateToProps = ({ providers }) => {
  return {
    providers: providers.available
  }
}

export default connect(mapStateToProps)(ProviderList)
