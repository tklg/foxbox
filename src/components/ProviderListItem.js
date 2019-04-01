import React from 'react'
import './providerlistitem.scss'

import Icon from './Icon'

let _url = ''
if (window.location.origin.indexOf('localhost') > -1) _url = 'http://localhost:3001'

const ProviderListItem = (props) => {
  return (
    <div className='provider-list-item'>
      <a href={_url + `/connect/${props.name.toLowerCase()}`}>
        <Icon icon={props.icon} />
        <span className='name'>{props.name}</span>
      </a>
    </div>
  )
}

export default ProviderListItem
