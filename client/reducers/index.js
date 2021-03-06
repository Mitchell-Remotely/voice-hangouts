const initialState = {
  user: JSON.parse(window.localStorage.getItem(window.location.hostname)) || {
    uid: '',
    userName: 'Guest',
    roomName: '',
    stream: null,
    mute: false
  },
  chatRoomReady: false,
  clients: new Map(),
  messages: []
}
if(initialState && initialState.user && initialState.user.uid)
  window.setUIDConfig(initialState.user.uid);
let mid = 0

function mergeUser (state, newState) {
  // Strip undefined properties
  Object.keys(newState).forEach(key => !newState[key] && delete newState[key])
  return { ...state, ...newState }
}

function mergeClient (
  state = {
    uid: '',
    userName: undefined,
    peerConn: undefined,
    stream: undefined,
    streamUrl: undefined,
    mute: false
  },
  newState
) {
  // Strip undefined properties
  Object.keys(newState).forEach(key => !newState[key] && delete newState[key])
  return { ...state, ...newState }
}

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case 'SET_USER': {
      if(!(initialState && initialState.user && initialState.user.uid) && state && state.user && (state.user.uid))
        window.setUIDConfig(state.user.uid);
      return { ...state, ...{ user: mergeUser(state.user, payload.user) } }
    }
    case 'ADD_MESSAGE': {
      const { uid, message, timestamp } = payload
      mid += 1
      return {
        ...state,
        messages: [
          {
            mid,
            uid,
            message,
            timestamp
          },
          ...state.messages
        ]
      }
    }
    case 'SET_CLIENT': {
      const client = mergeClient(state.clients.get(payload.uid), payload)
      return {
        ...state,
        ...{ clients: new Map(state.clients.set(payload.uid, client)) }
      }
    }
    case 'DELETE_CLIENT': {
      state.clients.delete(payload.uid)
      return { ...state, ...{ clients: new Map(state.clients) } }
    }
    case 'SET_CHATROOM_READY': {
      return { ...state, ...{ chatRoomReady: payload.chatRoomReady } }
    }
    case 'TOGGLE_USER_AUDIO': {
      if (state.user.uid === payload.uid) {
        return {
          ...state,
          ...{ user: { ...state.user, mute: !state.user.mute } }
        }
      }

      const client = state.clients.get(payload.uid)

      if (client) {
        client.mute = !client.mute
        return {
          ...state,
          ...{ clients: new Map(state.clients.set(payload.uid, client)) }
        }
      }

      return state
    }
    default: {
      return state
    }
  }
}
