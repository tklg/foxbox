import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import IconButton from '../components/IconButton'
import { fetchBody } from '../actions/mailbox'
import dayjs from 'dayjs'

import './message.scss'

class Message extends React.Component {
  constructor () {
    super()
    this.state = {
      reply: '',
      loading: false
    }
    this.setReply = this.setReply.bind(this)
  }
  setReply (e) {
    this.setState({
      reply: e.target.value
    })
  }
  componentDidUpdate (prevProps, prevState) {
    if (!this.props.data.body && !this.state.loading) {
      this.props.dispatch(fetchBody(this.props.provider, this.props.path, this.props.data.uid))
      this.setState({
        loading: true
      })
    } else if (this.props.data.body && this.state.loading) {
      this.setState({
        loading: false
      })
    }
  }
  render () {
    const envelope = this.props.data.envelope
    const date = dayjs(envelope.date)
    const isToday = date.isSame(dayjs(), 'day')
    let time = isToday ? date.format('h:mm a') : date.format('MMM D')
    if (date.isBefore(dayjs().subtract(1, 'year'))) time = date.format('MMM D YYYY')
    const fullTime = date.format('MMM D, YYYY [at] h:mm a')

    return (
      <div className={'mail' + (this.props.data.flags.includes('\\Seen') ? ' seen' : '') + (this.props.open ? ' open' : '')}>
        {!this.props.open &&
          <NavLink to={`/box/${this.props.provider}/${this.props.path}#${this.props.data.uid}`}>
            <div className='flex-container'>
              <div className='stack from'>
                <span className='from-name'>{envelope.from[0].name || envelope.from[0].address.split('@')[0]}</span>
                <span className='from-address'>{envelope.from[0].address}</span>
              </div>
              <span className='flex subject'>{envelope.subject}</span>
              <span className='date'>{time}</span>
            </div>
          </NavLink>
        }
        {this.props.open &&
          <div className='message flex-container flex-vertical'>
            <header>
              <NavLink to={`/box/${this.props.provider}/${this.props.path}`}>
                <h1>{envelope.subject}</h1>
              </NavLink>
            </header>
            <section className='flex flex-container flex-vertical'>
              <div className='info flex-container'>
                <div className='stack from flex'>
                  <span className='from-name'>{envelope.from[0].name || envelope.from[0].address.split('@')[0]}</span>
                  <span className='from-address'>{envelope.from[0].address}</span>
                </div>
                <div className='date'>
                  <span className='date'>{fullTime}</span>
                </div>
              </div>
              <div className='content text flex'>
                {this.state.loading &&
                  <div className='loader' />
                }
                {this.props.data.body && this.props.data.body && this.props.data.body.html && <div className='html' dangerouslySetInnerHTML={{ __html: this.props.data.body.html }} />}
                {this.props.data.body && !this.props.data.body.html && <p>{this.props.data.body.text}</p>}
              </div>
            </section>
            <footer className='reply flex-container'>
              <textarea className='flex' placeholder='Reply...' value={this.state.reply} onChange={this.setReply} />
              <button className='btn send' disabled={!this.state.reply.trim().length}>Send</button>
              <IconButton className='delete' icon='delete' />
            </footer>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = ({ providers, mailboxes, router }, { data }) => {
  const activeUid = router.location.hash.substr(1)
  return {
    open: data.uid.toString() === activeUid
  }
}

export default connect(mapStateToProps)(Message)
