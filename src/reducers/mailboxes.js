import actions from '../actions'
import dotProp from 'dot-prop-immutable'

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
    case actions.set_messages:
      var boxes = state[data.provider]
      if (boxes) {
        boxes = dotProp.set(boxes, dotPropPath(boxes, data.box.split('/')), box => {
          const m = box.messages || []
          return {
            ...box,
            messages: m.concat(data.messages).reduce((a, x) => a.findIndex(y => y.uid === x.uid) < 0 ? [...a, x] : a, [])
          }
        })
        return {
          ...state,
          [data.provider]: boxes
        }
      } else {
        throw new Error()
      }
    default: return state
  }
}

function dotPropPath (boxes, path, parts = []) {
  const part = path.shift()
  var i = boxes.findIndex(x => x.name === part)
  if (!path.length) {
    return parts.concat(i).join('.')
  } else {
    return dotPropPath(boxes[i].children, path, parts.concat(`${i}.children`))
  }
}
