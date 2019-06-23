import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Icon from '../components/Icon'
import './mailboxlistitem.scss'

class MailboxListItem extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState({
      open: !this.state.open
    })
  }
  render () {
    if (!this.props.children || !this.props.children.length) {
      return (
        <li className='mailbox-list-item'>
          <NavLink to={`/box/${this.props.box}/${this.props.path}`}>{this.props.displayName}</NavLink>
        </li>
      )
    } else {
      return (
        <li className='mailbox-list-item dropdown'>
          <span className='flex-container' onClick={this.toggle}>
            <span className='flex'>{this.props.displayName}</span>
            <Icon icon={this.state.open ? 'chevron-down' : 'chevron-right'} small />
          </span>
          {this.state.open &&
            <ul>
              {this.props.children.map((x, i) => (<ConnectedListItem key={x.path} {...x} />))}
            </ul>
          }
        </li>
      )
    }
  }
}

const mapStateToProps = ({ providers }) => {
  return {
    box: providers.active
  }
}

const ConnectedListItem = connect(mapStateToProps)(MailboxListItem)
export default ConnectedListItem
