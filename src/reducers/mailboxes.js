import actions from '../actions'

const initialState = {
  // connected provider indexes,
  active: null
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case actions.set_mailboxes_for_provider:
      return {
        ...state,
        [data.provider]: data.mailboxes
      }
    default: return state
  }
}
