import React from 'react'
import { connect } from 'react-redux'
import './home.scss'

class Home extends React.Component {
  constructor () {
    super()
  }
  render () {
    return <div className='home flex flex-container flex-vertical'>
      <header className='header flex-container'>
        <h1 className='flex'>Foxbox</h1>
        <nav>
          <a className='link primary' href='/login'>Login</a>
        </nav>
      </header>
    </div>
  }
}

export default Home
