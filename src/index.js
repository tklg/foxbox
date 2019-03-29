import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { CSSTransition } from 'react-transition-group'
import ErrorBoundary from './ErrorBoundary'
import reducer from './reducers'

import Login from './containers/login'
import './scss/app.scss'

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

const A = () =>
  <ErrorBoundary>
    <Provider store={store}>
      <Router basepath='/'>
        <Route path='/login' exact>
          {({ match }) => (
            <CSSTransition
              in={match != null}
              timeout={300}
              classNames='login'
              unmountOnExit>
              <Login />
            </CSSTransition>
          )}
        </Route>
      </Router>
    </Provider>
  </ErrorBoundary>

ReactDOM.render(<A />, document.getElementById('root'))
