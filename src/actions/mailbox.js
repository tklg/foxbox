import Ajax from '../lib/Ajax'
import uuid from 'uuid/v4'
import { setWorking, setError } from './providers'

let _url = `${window.location.origin}/api/mailboxes`
if (window.location.origin.indexOf('localhost') > -1) _url = 'http://localhost:3001/api/mailboxes'
const sUrl = _url + '/ws'
const getUrl = str => `${_url}/${str}`

const _actions = [
  'set_messages'
]
const actions = {}
for (const a of _actions) {
  actions[a] = a
}

export const fetchMessages = (provider, box, offset) => async (dispatch, getState) => {
  const u = uuid()
  dispatch(setWorking(u, true))
  try {
    const { data } = await Ajax.get({
      url: getUrl(`${provider}/${Buffer.from(box).toString('base64')}/messages?offset=${offset}`)
    })
    dispatch({
      type: actions.set_messages,
      data: {
        provider,
        box,
        messages: data
      }
    })
  } catch (e) {
    dispatch(setError(e))
  }
  return setWorking(u, false)
}

export default actions
