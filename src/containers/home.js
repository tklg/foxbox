import React from 'react'
import { connect } from 'react-redux'
import './home.scss'

let _url = ''
if (window.location.origin.indexOf('localhost') > -1) _url = 'http://localhost:3001'

class Home extends React.Component {
  constructor () {
    super()
  }
  render () {
    return <div className='home flex flex-container flex-vertical'>
      <header className='header flex-container'>
        <h1 className='flex'>Foxbox</h1>
        <nav>
          <a className='link primary' href={_url + '/login'}>Login</a>
        </nav>
      </header>
    </div>
  }
}

export default Home
