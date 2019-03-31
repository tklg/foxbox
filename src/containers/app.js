import React from 'react'
import { connect } from 'react-redux'
import './app.scss'

import MailboxList from './MailboxList'
import Mailbox from './Mailbox'

class App extends React.Component {
  constructor () {
    super()
  }
  render () {
    return <div className='app flex flex-container flex-vertical'>
      <header className='header flex-container'>
        <h1 className='flex'>Foxbox</h1>
        <nav>

        </nav>
      </header>
      <main className='flex flex-container'>
        <MailboxList />
        <Mailbox />
      </main>
    </div>
  }
}

export default App
