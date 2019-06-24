import React from 'react'
import { connect } from 'react-redux'
import Message from './Message'
import { fetchMessages } from '../actions/mailbox'
import './mailbox.scss'

import ProviderList from './ProviderList'

class Mailbox extends React.Component {
  constructor () {
    super()
    this.getMessage = this.getMessage.bind(this)
  }
  componentDidMount () {
    if (this.props.provider && this.props.path && !this.props.messages.length && this.props.flatboxes.length) {
      this.props.dispatch(fetchMessages(this.props.provider, this.props.path, this.props.flatboxes.find(x => x.path === this.props.path).messageCount))
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.props.provider && this.props.path && !this.props.messages.length && this.props.flatboxes.length) {
      this.props.dispatch(fetchMessages(this.props.provider, this.props.path, this.props.flatboxes.find(x => x.path === this.props.path).messageCount))
    }
  }
  getMessage (m, i) {
    return <Message data={m} {...{ provider: this.props.provider, path: this.props.path }} key={m.uid} />
  }
  render () {
    return <div className='mailbox flex'>
      {!this.props.mailboxes.length &&
        <div className='connect-provider flex-container flex-center'>
          <h1>Sign in to a mailbox to get started.</h1>
          <ProviderList />
        </div>
      }
      {this.props.mailboxes.length > 0 &&
        <div className='mails'>
          {this.props.messages.map(this.getMessage)}
        </div>
      }
    </div>
  }
}

function flat (arr) {
  let res = []
  for (const item of arr) {
    res.push(item)
    if (item.children.length) res = res.concat(flat(item.children))
  }
  return res
}

const mapStateToProps = ({ providers, mailboxes, router }) => {
  const route = router.location.pathname || ''
  const provider = providers.active
  const boxes = flat(mailboxes[provider] || [])
  const path = provider ? route.substr(5 + provider.length + 1) : ''

  let activeBox
  let messages = []
  if ((activeBox = boxes.find(x => x.path === path))) {
    if (activeBox.messages) messages = activeBox.messages
  }
  return {
    path,
    provider: provider,
    mailboxes: providers.connected,
    flatboxes: boxes,
    messages: messages
  }
}

export default connect(mapStateToProps)(Mailbox)
