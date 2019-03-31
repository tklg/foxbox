import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import ErrorBoundary from './ErrorBoundary'
import reducer from './reducers'

import Home from './containers/home'
import App from './containers/app'
import './scss/app.scss'

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

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
