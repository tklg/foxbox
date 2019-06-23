import actions from '../actions'

const initialState = {
  available: [],
  connected: [],
  active: -1
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case actions.set_providers:
      return {
        ...state,
        ...data,
        active: -1
      }
    case actions.set_provider:
      return {
        ...state,
        active: data
      }
    default: return state
  }
}
