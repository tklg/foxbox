import React from 'react'
import { NavLink } from 'react-router-dom'
import './mailboxlistitem.scss'

const MailboxListItem = (props) => {
  return (
    <li className='mailbox-list-item'>
      <NavLink to={`/box/${props.href}`}>{props.name}</NavLink>
    </li>
  )
}

export default MailboxListItem
