import React from 'react'
import { NavLink } from 'react-router-dom'
import './providerlistitem.scss'

import Icon from './Icon'

const ProviderListItem = (props) => {
  return (
    <div className='provider-list-item'>
      <a href={`/connect/${props.name.toLowerCase()}`}>
        <Icon icon={props.icon} />
        <span className='name'>{props.name}</span>
      </a>
    </div>
  )
}

export default ProviderListItem
