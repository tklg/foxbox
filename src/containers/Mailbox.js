import React from 'react'
import { connect } from 'react-redux'
import './mailbox.scss'

import ProviderList from './ProviderList'

class Mailbox extends React.Component {
  constructor () {
    super()
  }
  render () {
    return <div className='mailbox flex'>
      <ProviderList />
    </div>
  }
}

export default Mailbox
