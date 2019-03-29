import React from 'react'
import { connect } from 'react-redux'
import './login.scss'

class Login extends React.Component {
  constructor () {
    super()
  }
  render () {
    return <div className='login flex flex-container'>
      <div className='flex' />
      <section className='container'>
        <button className='btn'>button</button>
      </section>
    </div>
  }
}

const mapStateToProps = ({ login }) => {
  return {
    ...login
  }
}

export default connect(mapStateToProps)(Login)
