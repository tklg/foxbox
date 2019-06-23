import React from 'react'
import { NavLink } from 'react-router-dom'
import './mailboxlistitem.scss'

const MailboxListItem = (props) => {
  const name = props.name[0].toUpperCase() + props.name.substr(1).toLowerCase()
  if (!props.children || !props.children.length) {
    return (
      <li className='mailbox-list-item'>
        <NavLink to={`/box/${props.path}`}>{name}</NavLink>
      </li>
    )
  } else {
    return (
      <li className='mailbox-list-item dropdown'>
        <span>{name}</span>
        <ul>
          {props.children.map((x, i) => (<MailboxListItem key={x.path} {...x} />))}
        </ul>
      </li>
    )
  }
}

export default MailboxListItem
