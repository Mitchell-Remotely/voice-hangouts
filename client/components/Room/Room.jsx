import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '../../actions'
import VolumeMeter from '../VolumeMeter'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faMicrophoneSlash,faVolumeOff, faSignOutAlt, faMicrophone, faVolumeUp, } from "@fortawesome/free-solid-svg-icons";
import styles from './Room.css'

function Room ({
  chatRoomReady,
  clients,
  connector,
  messages,
  setUser,
  toggleUserAudio,
  user
}) {
  window.connector = connector;
  window.getMuted = false;
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

      return () => {
        window.removeEventListener(onLeaveRoom)
      }
    },
    [connector, setUser]
  )

  function onEditUserName () {
    const userName = window.prompt('Edit your username:', user.userName)
    setUser({ userName })
    connector.sendUpdate({ uid: user.uid, userName })
  }

  function onSendMessage ({ key, type, currentTarget }) {
    const message = currentTarget.value

    if ((key === 'Enter' || type === 'click') && message) {
      connector.sendMessage(message)
      currentTarget.value = ''
    }
  }
  function onUserControlClickSelf(){
    connector.toggleMediaStream(user.uid)
    toggleUserAudio(user.uid)
  }
  function onUserControlClick ({ target }) {
    const { uid } = target.dataset

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

  function isUrl (url) {
    return /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi.test(
      url
    )
  }
  function endMeeting(){
    window.location = "https://www.remotelyhq.com/post-call-survey";
  }

  // Try to mute all video and audio elements on the page
  function toggleMutePage() {
    users.forEach( u =>{ 
      if(u.uid === user.uid) return;
      connector.toggleMediaStream(u.uid)
      toggleUserAudio(u.uid)
    });
    window.getMuted = !window.getMuted;
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
              className={
                styles.bottomGridButton + ' ' + getUserControlIcon(uid, mute)
              }
              onClick={onUserControlClick}
              disabled={!stream}
              data-uid={uid}
              data-mute={mute}
            >
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
            autoFocus
            className={styles.messageInput}
            disabled={!chatRoomReady}
            placeholder='type message here...'
            onKeyPress={onSendMessage}
          />
          <button
            className={styles.sendButton}
            disabled={!chatRoomReady}
            value='Send'
            onClick={onSendMessage}
          />
        </div>
      </div>
      {Array.from(clients)
        .filter(([, peer]) => peer.streamUrl)
        .map(([id, peer]) => (
          <audio key={id} autoPlay src={peer.streamUrl} />
        ))}
      <div className={styles.bottomGrid}>
        <div className={styles.bottomButtons}>
        <button className={styles.bottomGridButton} onClick={onUserControlClickSelf}>{
          user.mute?
          <FontAwesomeIcon icon={faMicrophoneSlash} style={{fontSize: "22px"}} />
          :
          <FontAwesomeIcon icon={faMicrophone} style={{fontSize: "22px"}} />
          }</button>
          <button className={styles.bottomGridButton} onClick={endMeeting}><FontAwesomeIcon icon={faSignOutAlt} style={{fontSize: "22px", color:"#f44336"}} /></button>
        </div>
        <div className={styles.bottomInput}>
          <input readOnly className={styles.bottomGridInputCopy} value={window.location.href}></input>
          <button className={styles.bottomGridButtonCopy}>Copy link</button>
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
    user: state.user
  }),
  dispatch => ({
    addMessage: (userName, message) =>
      dispatch(Actions.addMessage(userName, message)),
    setUser: payload => dispatch(Actions.setUser(payload)),
    toggleUserAudio: uid => dispatch(Actions.toggleUserAudio(uid))
  })
)(Room)
