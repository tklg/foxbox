import Ajax from '../lib/Ajax'
import uuid from 'uuid/v4'
import { push } from 'connected-react-router'

let _url = `${window.location.origin}/api/providers`
if (window.location.origin.indexOf('localhost') > -1) _url = 'http://localhost:3001/api/providers'
const sUrl = _url + '/ws'
const getUrl = str => `${_url}/${str}`

const _actions = [
  'set_working',
  'set_error',
  'set_providers',
  'set_provider',
  'set_mailboxes_for_provider'
]
const actions = {}

export const setWorking = (uuid, working) => ({
  type: actions.set_working,
  data: { uuid, working }
})

export const setError = e => ({
  type: actions.set_error,
  data: e
})

export const fetchProviders = () => async (dispatch, getState) => {
  const u = uuid()
  dispatch(setWorking(u, true))
  try {
    const { data } = await Ajax.get({
      url: getUrl('list')
    })
    dispatch({
      type: actions.set_providers,
      data
    })

    if (data.connected && data.connected.length) {
      dispatch(setProvider(data.connected[0].id))
    }
  } catch (e) {
    dispatch(setError(e))
  }
  return setWorking(u, false)
}

export const setProvider = (id) => async (dispatch, getState) => {
  const u = uuid()
  dispatch(setWorking(u, true))
  try {
    dispatch({
      type: actions.set_provider,
      data: id
    })
    dispatch(push(`/box/${id}`))
    const { data } = await Ajax.get({
      url: getUrl(`${id}/mailboxes`)
    })
    dispatch({
      type: actions.set_mailboxes_for_provider,
      data: {
        provider: id,
        mailboxes: data
      }
    })

    if (data[0]) {
      dispatch(push(`/box/${id}/${data[0].path}`))
    }
  } catch (e) {
    dispatch(setError(e))
  }
  return setWorking(u, false)
}

for (const a of _actions) {
  actions[a] = a
}
export default actions
