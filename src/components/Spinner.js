import React from 'react'
import './progress.scss'

const Spinner = props => (
  <div className='spinner'>
    <div className='right-side'>
      <div className='bar' />
    </div>
    <div className='left-side'>
      <div className='bar' />
    </div>
  </div>
)

export default Spinner
