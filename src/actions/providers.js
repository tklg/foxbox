import Ajax from '../lib/Ajax'
import uuid from 'uuid/v4'

let _url = `${window.location.origin}/api/providers`
if (window.location.origin.indexOf('localhost') > -1) _url = 'http://localhost:3001/api/providers'
const sUrl = _url + '/ftpws'
const getUrl = str => `${_url}/${str}`

const _actions = [
  'set_working',
  'set_error',
  'set_providers'
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
  } catch (e) {
    dispatch(setError(e))
  }
  return setWorking(u, false)
}

for (const a of _actions) {
  actions[a] = a
}
export default actions
