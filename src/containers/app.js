import React from 'react'
import { connect } from 'react-redux'
import './app.scss'
import { CSSTransition } from 'react-transition-group'
import MailboxList from './MailboxList'
import Mailbox from './Mailbox'

import { fetchProviders } from '../actions/providers'

class App extends React.Component {
  constructor () {
    super()
  }
  componentDidMount () {
    this.props.dispatch(fetchProviders())
  }
  render () {
    return <div className='app flex flex-container flex-vertical'>
      <header className='header flex-container'>
        <h1 className='flex'>Foxbox</h1>
        <nav> </nav>
      </header>
      <main className='flex flex-container'>
        <CSSTransition
          in={this.props.mailboxes.length > 0}
          timeout={300}
          classNames='mailbox-list'
          unmountOnExit>
          <MailboxList />
        </CSSTransition>
        <Mailbox />
      </main>
    </div>
  }
}

const mapStateToProps = ({ mailboxes }) => {
  return {
    mailboxes: mailboxes.all
  }
}

export default connect(mapStateToProps)(App)
