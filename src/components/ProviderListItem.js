import React from 'react'
import { NavLink } from 'react-router-dom'
import './providerlistitem.scss'

const ProviderListItem = (props) => {
  return (
    <div className='provider-list-item flex-container flex-center'>
      <a>{props.name}</a>
    </div>
  )
}

export default ProviderListItem
