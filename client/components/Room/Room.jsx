import PropTypes from 'prop-types'
import React, { useState,useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '../../actions'
import VolumeMeter from '../VolumeMeter'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserEdit,faInfoCircle, faMicrophoneSlash,faVolumeOff, faSignOutAlt, faMicrophone, faVolumeUp, } from "@fortawesome/free-solid-svg-icons";
import styles from './Room.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';

let copied = false;
function Room ({
  chatRoomReady,
  clients,
  connector,
  messages,
  setUser,
  toggleUserAudio,
  user
}) {
  const [,setState] = useState();
  window.connector = connector;
  window.getMuted = false;
  const textInput = React.createRef();
  useEffect(
    () => {
      function onLeaveRoom () {
        connector.leaveRoom()
      }

      ;(async () => {
        connector.connect()
        setUser({ stream: await connector.getUserMedia(), roomName: window.location.pathname.split('/')[1] })
        connector.joinRoom()
        window.addEventListener('beforeunload', onLeaveRoom)
      })()

      window.addEventListener('blur', onBlur);
      return () => {
        window.removeEventListener(onLeaveRoom)
        window.removeEventListener('blur', onBlur);
      }
    },
    [connector, setUser]
  )

  function onEditUserName () {
    const userName = window.prompt('Edit your username:', user.userName)
    setUser({ userName })
    connector.sendUpdate({ uid: user.uid, userName })
  }
  function onSendMessageButton({ key, type}){
    const message = textInput.current.value
    if ((key === 'Enter' || type === 'click') && message) {
      connector.sendMessage(message)
      textInput.current.value = '';
    }
  }
  function onSendMessage ({ key, type, currentTarget }) {
    const message = currentTarget.value

    if ((key === 'Enter' || type === 'click') && message) {
      connector.sendMessage(message)
      currentTarget.value = '';
    }
  }
  function onUserControlClickSelf(){
    connector.toggleMediaStream(user.uid)
    toggleUserAudio(user.uid)
  }
  function onUserControlClick (uid) {
    connector.toggleMediaStream(uid)
    toggleUserAudio(uid)
  }

  function getUserControlIcon (uid, mute) {
    if (user.uid === uid) {
      return !mute ? styles.mic : styles.micOff
    } else {
      return !mute ? styles.volumeUp : styles.volumeOff
    }
  }
  function GetName(props){
    if(props.uid === user.uid)
      return <span className={styles.userName}>{props.userName} &nbsp; <FontAwesomeIcon icon={faEdit} style={{fontSize: "12px"}} /></span>
    return <span className={styles.userName}>{props.userName}</span>
  }

  function getUserName (uid) {
    if (uid === user.uid) {
      return user.userName
    }

    const client = clients.get(uid)
    return client ? client.userName : 'Guest'
  }

  
  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    copied = false;
  };
  function setCopied(){
    copied = true;
    setState({});
  }

  function isUrl (url) {
    return /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi.test(
      url
    )
  }
  function endMeeting(){
    window.location = "https://www.remotelyhq.com/post-call-survey";
  }
  const users = [user, ...Array.from(clients.values())].filter(
    client => client.uid
  )
  const divStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  return (
    <div className={styles.room} style={divStyle}>
      <iframe id="room" src={process.env.GAME_ASSETS_URL+"/index.html"} className={styles.iframe}></iframe>
      <div className={styles.userList}>
        {users.map(({ uid, userName, stream, mute }) => (
          <div key={uid} className={styles.userListRow}>
            <button
              className={ styles.topUserIcon }
              onClick={()=>{onUserControlClick(uid)}}
              disabled={!stream}
              data-uid={uid}
              data-mute={mute}
            >
              {
                user.uid === uid ? (
                mute?
                <FontAwesomeIcon icon={faMicrophoneSlash} style={{fontSize: "16px",  color:"#f44336"}} />
                :
                <FontAwesomeIcon icon={faMicrophone} style={{fontSize: "16px"}} />
                ):
                (
                  mute?
                  <FontAwesomeIcon icon={faVolumeOff} style={{fontSize: "16px", color:"#f44336"}} />
                  :
                  <FontAwesomeIcon icon={faVolumeUp} style={{fontSize: "16px"}} />
                )
              }
              </button>
              {
              user.uid === uid ? 
              <button
                className={styles.userNameBox}
                title='Click to edit your name'
                onClick={onEditUserName}
                onKeyPress={onEditUserName}
              >
                <GetName userName={userName} uid={uid}></GetName>
              </button>
              :
              <GetName userName={userName} uid={uid}></GetName>
            }
            {stream && (
              <VolumeMeter uid={uid} enabled={!!stream && !mute} stream={stream} />
            )}
          </div>
        ))}
      </div>
      <div className={styles.chatRoom}>
        <div className={styles.messages}>
          {messages.map(msg => (
            <div key={msg.mid} className={styles.messageRow}>
              <div className={styles.messageUser}>
                {`${getUserName(msg.uid)}:`}
              </div>
              <div className={styles.messageContent}>
                {!isUrl(msg.message) ? (
                  msg.message
                ) : (
                  <a target='_blank' href={msg.message}>
                    {msg.message}
                  </a>
                )}
              </div>
              <div
                className={styles.timestamp}
                title={msg.timestamp.toLocaleDateString()}
              >
                {`${msg.timestamp.toLocaleTimeString()}`}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.messageBox} disabled={!chatRoomReady}>
          <input
            ref={textInput}
            autoFocus
            className={styles.messageInput}
            disabled={!chatRoomReady}
            placeholder='type message here...'
            onKeyPress={onSendMessage}
          />
          <button
            className={styles.sendButton}
            disabled={!chatRoomReady}
            onClick={onSendMessageButton}
          />
        </div>
      </div>
      {Array.from(clients)
        .filter(([, peer]) => peer.streamUrl)
        .map(([id, peer]) => (
          <audio key={id} autoPlay src={peer.streamUrl} />
        ))}
      <div className={styles.bottomGrid}>
        {users.length <= 1 && 
            (copied ?
            <div className={styles.infoBox}>
              <FontAwesomeIcon icon={faInfoCircle} style={{fontSize: "65px", color: "#26a388", marginRight:"10px"}} /> 
              <div className={styles.copyText} >Link copied! Share the link with your crew.</div>
            </div>:
            <div className={styles.infoBox}>
              <FontAwesomeIcon icon={faInfoCircle} style={{fontSize: "65px", color: "#cc3300", marginRight:"10px"}} /> 
              <div className={styles.copyText} >Copy and share the link below to invite your crew.</div>
            </div>
            )
        }
        <div className={styles.bottomInput}>
          <input readOnly className={styles.bottomGridInputCopy} value={window.location.href}></input>
          {users.length <= 1 ?
            (copied ?
            <CopyToClipboard text={window.location.href}
              onCopy={setCopied}>
              <button
                className={styles.bottomGridButtonCopy }
                style={{color:"#26a388"}}
                >Copied!</button>
            </CopyToClipboard> :
            <CopyToClipboard text={window.location.href}
              onCopy={setCopied}>
              <button
                className={styles.bottomGridButtonCopy + ' ' + styles.shake}
                style={{color:"#cc3300"}}
                >Copy link</button>
            </CopyToClipboard>
            ):
            <CopyToClipboard text={window.location.href}
              onCopy={()=>copied = true}>
              <button
                className={styles.bottomGridButtonCopy}
                >Copy link</button>
            </CopyToClipboard>
            
          }
          <button className={styles.bottomGridButton} onClick={onUserControlClickSelf}>{
            user.mute?
            <FontAwesomeIcon icon={faMicrophoneSlash} style={{fontSize: "22px", color:"#f44336"}} />
            :
            <FontAwesomeIcon icon={faMicrophone} style={{fontSize: "22px"}} />
            }
            <br/>
            <span className={styles.buttonText}>Mic</span>
          </button>
          <button className={styles.bottomGridButton} onClick={onEditUserName}><FontAwesomeIcon icon={faUserEdit} style={{fontSize: "22px"}} /><br/><span className={styles.buttonText}>Name</span></button>
          <button className={styles.bottomGridButton} onClick={endMeeting}><FontAwesomeIcon icon={faSignOutAlt} style={{fontSize: "22px", color:"#f44336"}} /><br/><span className={styles.buttonText}>Leave</span></button>
        
        </div>
      </div>
    </div>
  )
}

Room.propTypes = {
  connector: PropTypes.object.isRequired,
  chatRoomReady: PropTypes.bool.isRequired,
  clients: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
  setUser: PropTypes.func.isRequired,
  toggleUserAudio: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default connect(
  state => ({
    clients: state.clients,
    chatRoomReady: state.chatRoomReady,
    messages: state.messages,
    user: state.user,
  }),
  dispatch => ({
    addMessage: (userName, message) =>
      dispatch(Actions.addMessage(userName, message)),
    setUser: payload => dispatch(Actions.setUser(payload)),
    toggleUserAudio: uid => dispatch(Actions.toggleUserAudio(uid))
  })
)(Room)
