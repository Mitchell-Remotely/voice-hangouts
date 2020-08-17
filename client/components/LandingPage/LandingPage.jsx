import  React, {useState}  from 'react'
import styles from './LandingPage.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/fontawesome-free-regular'

const DOMAIN_URL = window.location.hostname +"/"

function LandingPage () {
  const [disabled, setDisabled] = useState(false);
  function joinRoom () {
    window.location.pathname = inputVal;
  }

  function onRoomNameKeyPress (evt) {
    if (evt.key === 'Enter') {
      joinRoom(evt)
    }
  }
  function createGuid(){  
    function S4() {  
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
    }  
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();  
  }  

  let inputVal = createGuid();
  let copied = false;
  return (
    <div className={styles.landingPage}>
      <h1>Remotely rooms</h1>
      <p key='subtitle'>Immersive meetings</p>
      <div key='form' className={styles.startChatForm}>
        <div>
          <span className={styles.createRoomInput}>
            <input
              className={styles.roomNameInput}
              defaultValue = {DOMAIN_URL + inputVal}
              onKeyPress={onRoomNameKeyPress}
              disabled={disabled}
            />      
          </span> 
          <CopyToClipboard text={DOMAIN_URL + inputVal}
            onCopy={() => copied = true}>
            <button
              className={styles.startChatButton}
              >
                <FontAwesomeIcon icon={faCopy} />
            </button> 
          </CopyToClipboard>
        </div>
    </div>
    <div>
      <button
        className={styles.startChatButton}
        onClick={joinRoom}
      >
        Go to room
      </button>
      <br/>
      {copied ? <span style={{color: 'red'}}>Copied.</span> : null}
    </div>
  </div>
  )
}

export default LandingPage
