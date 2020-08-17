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
import MeetingEnd from './components/MeetingEnd'
import './index.css'
import axios from 'axios'

window.AudioContext = window.AudioContext || window.webkitAudioContext

const ROOM_NAME = window.location.pathname.replace('/', '') || ''
const store = configureStore()
const actions = bindActionCreators(Actions, store.dispatch)
let connector ;

async function GetConnector(){
  if(!ROOM_NAME) return;
  let response = await axios({method:'post',
    url:"https://fa-remotely-meetings-service.azurewebsites.net/api/FindServer",
    data:{
      meetingRoomID: ROOM_NAME 
    },
    headers:{'content-type':'application/json'}
  });
  console.log("Response " , response);
  connector = new Connector(response.data.replace('http', 'ws'), actions, store);
  render(
    <Provider store={store}>
      {
        (
          !ROOM_NAME ? 
          (
            <LandingPage connector={connector} />
          )
           :
          ( ROOM_NAME == "post-meeting" ?
            (<MeetingEnd connector={connector}/>) : 
            (connector ? 
              <Room connector={connector} /> :
              <span></span>
              )
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
        ( ROOM_NAME == "post-meeting" ?
          (<MeetingEnd connector={connector}/>) : 
          (connector ? 
            <Room connector={connector} /> :
            <span></span>
            )
        )
      )
    }
  </Provider>,
  document.getElementById('root')
);
