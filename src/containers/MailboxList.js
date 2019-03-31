import React from 'react'
import { connect } from 'react-redux'
import './mailboxlist.scss'
import MailboxListItem from '../components/MailboxListItem'

class MailboxList extends React.Component {
  constructor () {
    super()
    this.state = {
      mailboxes: [{
        name: 'foo',
        href: 'foo'
      }, {
        name: 'bar',
        href: 'bar'
      }]
    }
    this.getMailboxes = this.getMailboxes.bind(this)
  }
  getMailboxes (boxes) {
    return boxes.map((b, i) => {
      return <MailboxListItem key={b.id || i} {...b} />
    })
  }
  render () {
    return <nav className='mailbox-list'>
      <ul>
        {this.getMailboxes(this.state.mailboxes)}
      </ul>
    </nav>
  }
}

export default MailboxList
