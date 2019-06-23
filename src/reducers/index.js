import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import providers from './providers'
import mailboxes from './mailboxes'

export default history => combineReducers({
  router: connectRouter(history),
  providers,
  mailboxes
})
