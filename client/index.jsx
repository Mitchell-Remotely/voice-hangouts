import React from 'react'
import { render } from 'react-dom'
import { bindActionCreators } from 'redux'
import { Provider } from 'react-redux'
import 'webrtc-adapter'
import Actions from './actions'
import configureStore from './store'
import Connector from './connector'
import LandingPage from './components/LandingPage'
import Room from './components/Room'
import RoomMobile from './components/RoomMobile'
import MeetingEnd from './components/MeetingEnd'
import './index.css'
import axios from 'axios'

window.AudioContext = window.AudioContext || window.webkitAudioContext

const ROOM_NAME = window.location.pathname.replace('/', '') || ''
const store = configureStore()
const actions = bindActionCreators(Actions, store.dispatch)
let connector = new Connector(window.location.href.replace('http', 'ws'));

async function GetConnector(){
  if(!ROOM_NAME) return;
  connector = new Connector(ROOM_NAME,actions, store, (window.location.search || ''));
  render(
    <Provider store={store}>
      {
        (
          !ROOM_NAME ? 
          (
            <LandingPage connector={connector} />
          )
           : 
          (connector ? 
            (window.isMobile ? <RoomMobile connector={connector}/> : <Room connector={connector} /> ):
            <span></span>
          )
        )
      }
    </Provider>,
    document.getElementById('root')
  );
}
GetConnector();

render(
  <Provider store={store}>
    {
      (
        !ROOM_NAME ? 
        (
          <LandingPage connector={connector} />
        )
         :
        (connector ? 
          (window.isMobile ? <RoomMobile connector={connector}/> : <Room connector={connector} /> ):
          <span></span>
          )
      )
    }
  </Provider>,
  document.getElementById('root')
);
