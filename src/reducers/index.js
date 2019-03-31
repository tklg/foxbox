import { combineReducers } from 'redux'
import providers from './providers'
import mailboxes from './mailboxes'

export default combineReducers({
  providers,
  mailboxes
})
