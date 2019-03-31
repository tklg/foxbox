import React from 'react'
import { connect } from 'react-redux'
import './mailboxlist.scss'
import MailboxListItem from '../components/MailboxListItem'

class MailboxList extends React.Component {
  constructor () {
    super()
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
        {this.getMailboxes(this.props.mailboxes)}
      </ul>
    </nav>
  }
}

const mapStateToProps = ({ mailboxes }) => {
  return {
    mailboxes: mailboxes.all
  }
}

export default connect(mapStateToProps)(MailboxList)
