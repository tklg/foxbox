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
      {!this.props.mailboxes.length &&
        <div className='connect-provider flex-container flex-center'>
          <h1>Sign in to a mailbox to get started.</h1>
          <ProviderList />
        </div>
      }
    </div>
  }
}

const mapStateToProps = ({ mailboxes }) => {
  return {
    mailboxes: mailboxes.all
  }
}

export default connect(mapStateToProps)(Mailbox)
