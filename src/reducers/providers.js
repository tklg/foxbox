import actions from '../actions/providers'

const initialState = {
  all: []
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case actions.set_providers:
      return {
        ...state,
        all: data
      }
    default: return state
  }
}
