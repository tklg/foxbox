import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import ErrorBoundary from './ErrorBoundary'
import reducer from './reducers'
import Ajax from './lib/Ajax'

import Home from './containers/home'
import App from './containers/app'
import './scss/app.scss'

let _url = `${window.location.origin}/api`
if (window.location.origin.indexOf('localhost') > -1) _url = 'http://localhost:3001/api'

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

const tokCookie = decodeURIComponent(document.cookie).split(' ').find(x => x.startsWith('tok='))
if (tokCookie && tokCookie.length > 4) {
  window.localStorage.setItem('foxbox_token', tokCookie.substr(4))
  document.cookie = 'tok=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
const tokens = JSON.parse(window.localStorage.getItem('foxbox_token') || '{}')
Ajax.setTokenData({
  ...tokens,
  refresh_url: _url + '/token'
})

const A = () =>
  <ErrorBoundary>
    <Provider store={store}>
      <Router basepath='/'>
        <Route path='/' exact component={Home} />
        <Route path='/box' exact component={App} />
      </Router>
    </Provider>
  </ErrorBoundary>

ReactDOM.render(<A />, document.getElementById('root'))
