import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '../../actions'
import VolumeMeter from '../VolumeMeter'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faUserEdit, faMicrophoneSlash,faVolumeOff, faSignOutAlt, faMicrophone, faVolumeUp, } from "@fortawesome/free-solid-svg-icons";
import styles from './RoomMobile.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';

function RoomMobile ({
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
        //window.removeEventListener(onLeaveRoom)
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

  let copied = false;
  return (
    <div className={styles.room} style={divStyle}>
      <video autoPlay={true} loop={true} muted={true} src="assets/ColorCampfire.webm" style={{objectFit: 'cover', height: '100vh',width:'100%'}}/>
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
                <FontAwesomeIcon icon={faMicrophoneSlash} style={{fontSize: "30px"}} />
                :
                <FontAwesomeIcon icon={faMicrophone} style={{fontSize: "30px"}} />
                ):
                (
                  mute?
                  <FontAwesomeIcon icon={faVolumeOff} style={{fontSize: "30px"}} />
                  :
                  <FontAwesomeIcon icon={faVolumeUp} style={{fontSize: "30px"}} />
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
      </div>
      {Array.from(clients)
        .filter(([, peer]) => peer.streamUrl)
        .map(([id, peer]) => (
          <audio key={id} autoPlay src={peer.streamUrl} />
        ))}
        <div className={styles.bottomGrid}>
          <div className={styles.bottomInput}>
            <input readOnly className={styles.bottomGridInputCopy} value={window.location.href}></input>
            <CopyToClipboard text={window.location.href}
              onCopy={() => copied = true}>
              <button
                className={styles.bottomGridButtonCopy}
                >Copy link</button>
            </CopyToClipboard>
            <button className={styles.bottomGridButton} onClick={onUserControlClickSelf}>{
              user.mute?
              <FontAwesomeIcon icon={faMicrophoneSlash} style={{fontSize: "45px", marginBottom: "10px", color:"#f44336"}} />
              :
              <FontAwesomeIcon icon={faMicrophone} style={{fontSize: "45px", marginBottom: "10px"}} />
              }
              <br/>
              <span className={styles.buttonText}>Mic</span>
            </button>
            <button className={styles.bottomGridButton} onClick={onEditUserName}><FontAwesomeIcon icon={faUserEdit} style={{fontSize: "45px", marginBottom: "10px"}} /><br/><span className={styles.buttonText}>Name</span></button>
            <button className={styles.bottomGridButton} onClick={endMeeting}><FontAwesomeIcon icon={faSignOutAlt} style={{fontSize: "45px", marginBottom: "10px", color:"#f44336"}} /><br/><span className={styles.buttonText}>Leave</span></button>
          
          </div>
        </div>
    </div>
  )
}

RoomMobile.propTypes = {
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
)(RoomMobile)
