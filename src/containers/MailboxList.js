import React from 'react'
import { connect } from 'react-redux'
import MailboxListItem from '../components/MailboxListItem'
import Icon from '../components/Icon'
import Select from './Select'
import { setProvider } from '../actions/providers'
import './mailboxlist.scss'

class MailboxList extends React.Component {
  constructor () {
    super()
    this.getMailboxes = this.getMailboxes.bind(this)
  }
  getMailboxes (boxes) {
    return boxes.map((b, i) => {
      return <MailboxListItem key={b.path} {...b} />
    })
  }
  getProvider ({ item, index }) {
    return (
      <div><Icon icon={item.icon} /><span>{item.name}</span></div>
    )
  }
  render () {
    return <div className='flex-container flex-vertical mailbox-list'>
      <Select
        items={this.props.providers}
        itemRenderer={this.getProvider}
        activeIndex={this.props.activeProvider}
        placeholder='Select mailbox'
        onChange={(i) => this.props.dispatch(setProvider(i))} />

      <ul className='flex'>
        {this.getMailboxes(this.props.mailboxes)}
      </ul>
    </div>
  }
}

const mapStateToProps = ({ providers, mailboxes }) => {
  return {
    providers: providers.connected,
    mailboxes: providers.active > -1 && mailboxes[providers.active] ? mailboxes[providers.active] : [],
    activeProvider: providers.active
  }
}

export default connect(mapStateToProps)(MailboxList)
