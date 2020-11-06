import React, { useState,useEffect } from 'react'
import styles from './LandingPage.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/fontawesome-free-regular'
import { faDiscord,faYoutube } from '@fortawesome/free-brands-svg-icons'

const DOMAIN_URL = window.location.hostname +"/"

function LandingPage () {
  const [,setState] = useState();
  const [disabled, setDisabled] = useState(false);
  let words = ["productive"," immersed","inspired","connected"];
  const [word,setWord] = useState(words[0]);
  const [upTo,setUpTo] = useState(0);
  function joinRoom () {
    window.location.pathname = inputVal;
  }
  useEffect(() => {
    let changeWord = ()=>{
      setUpTo(upTo+1);
      setWord(words[ upTo % words.length]);
    }
    setTimeout(changeWord, 1000);
    
  });

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
  function toDiscord(){
    window.open("https://discord.gg/sfBbMArpUd", "_blank");
  }
  function toYoutube(){
    window.open("https://www.youtube.com/channel/UCoj3EXe8wbdCuohp0BOz_qg", "_blank");
  }
  function currentYear(){
    return new Date().getFullYear();
  }
  function setCopied(){
    copied = true;
    setState({});
  }

  let inputVal = createGuid();
  let copied = false;
  return (
    <div className={styles.landingPage}>
      <div className={styles.headerBar} dangerouslySetInnerHTML={{__html:  `<div class="header__logo">
        <a href="/" class="svg__logo svg__logo--white" style="
    /* width: 300px; */
">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" style="
    height: 42px;
">
                <style type="text/css">
                    .st0 {
                        fill: url(#SVGID_1_);
                    }

                    .st1 {
                        fill: url(#Helmet_x5F_Cut_1_);
                    }

                    .st2 {
                        fill: #FFFFFF;
                    }

                    .st3 {
                        fill: #9C00C7;
                    }

                    .st4 {
                        fill: url(#SVGID_2_);
                    }
                </style>
                <g>
                    <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="32.3098" y1="11.4162" x2="119.0976" y2="136.2266">
                        <stop offset="6.600384e-04" style="stop-color:#9C00C7"></stop>
                        <stop offset="0.1565" style="stop-color:#963BD6"></stop>
                        <stop offset="0.3122" style="stop-color:#906EE2"></stop>
                        <stop offset="0.4646" style="stop-color:#8C97ED"></stop>
                        <stop offset="0.6121" style="stop-color:#88B8F5"></stop>
                        <stop offset="0.7533" style="stop-color:#86CFFA"></stop>
                        <stop offset="0.8855" style="stop-color:#85DDFE"></stop>
                        <stop offset="1" style="stop-color:#84E2FF"></stop>
                    </linearGradient>
                    <circle class="st0" cx="80" cy="80" r="77.6"></circle>
                    <linearGradient id="Helmet_x5F_Cut_1_" gradientUnits="userSpaceOnUse" x1="33.1319" y1="151.7394" x2="118.0282" y2="21.7971">
                        <stop offset="4.239654e-02" style="stop-color:#9C00C7"></stop>
                        <stop offset="0.2219" style="stop-color:#9540D7"></stop>
                        <stop offset="0.3263" style="stop-color:#9261DF"></stop>
                        <stop offset="0.3445" style="stop-color:#9167E0"></stop>
                        <stop offset="0.4935" style="stop-color:#8D93EB"></stop>
                        <stop offset="0.6374" style="stop-color:#89B5F4"></stop>
                        <stop offset="0.773" style="stop-color:#86CEFA"></stop>
                        <stop offset="0.897" style="stop-color:#85DDFE"></stop>
                        <stop offset="0.9986" style="stop-color:#84E2FF"></stop>
                    </linearGradient>
                    <path id="Helmet_x5F_Cut_15_" class="st1" d="M80.1,2.4C37.1,2.4,2.4,37.1,2.4,80.1c0,43.4,35.4,77.5,77.6,77.6   c42.9,0,77.7-34.8,77.7-77.7C157.6,36.6,123.2,2.4,80.1,2.4z M50.1,109.3l0-84.7c0-6.6,4-12.6,10.2-15.1c7.9-3.2,16.6-4.9,25.7-4.9   c22.3,0,42.2,10.6,54.9,27.1c9,11.6,14.4,26.2,14.5,42c0.1,9-1.6,17.7-4.7,25.6c-2.4,6.1-8.2,10.1-14.8,10.1L50.1,109.3z"></path>
                    <path class="st2" d="M132.1,96.2c-1.7-14.4-7.2-27.7-15.6-38.6c0.3-0.3,0.6-0.5,0.8-0.8c8.1-8.1,12-17.4,8.7-20.7   c-3.3-3.3-12.6,0.6-20.7,8.7c-0.2,0.2-0.3,0.3-0.4,0.5c-11.7-10-26.3-16.7-42.4-18.6c-4.6-0.5-8.6,3-8.6,7.7v68.5c0,1.1,0.9,2,2,2   h68.5C129.1,104.8,132.7,100.8,132.1,96.2z"></path>
                    <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -12.1673 76.139)" class="st3" cx="85.8" cy="52.8" rx="3.7" ry="12.6"></ellipse>
                    <g>
                        <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="95.0734" y1="63.7933" x2="37.8764" y2="120.3252">
                            <stop offset="2.748116e-03" style="stop-color:#A711E3"></stop>
                            <stop offset="9.339047e-02" style="stop-color:#A22AE5"></stop>
                            <stop offset="0.3299" style="stop-color:#9666E9"></stop>
                            <stop offset="0.5472" style="stop-color:#8D95ED"></stop>
                            <stop offset="0.7382" style="stop-color:#86B7EF"></stop>
                            <stop offset="0.8957" style="stop-color:#82CBF0"></stop>
                            <stop offset="1" style="stop-color:#80D3F1"></stop>
                        </linearGradient>
                        <path class="st4" d="M52.3,130.4c-12.9,0.6-23.8-9.4-24.4-22.3c-0.6-12.9,9.4-23.8,22.3-24.4c12.9-0.6,23.8,9.4,24.4,22.3    S65.2,129.8,52.3,130.4z M50.7,92.7c-7.9,0.4-14.1,7.1-13.7,15c0.4,7.9,7.1,14.1,15,13.7c7.9-0.4,14.1-7.1,13.7-15    S58.6,92.3,50.7,92.7z"></path>
                        <circle class="st2" cx="51.3" cy="107.1" r="18.9"></circle>
                    </g>
                </g>
            </svg>
        </a>
        <a href="/" class="svg__title svg__title--white" style="height: 42px;">

            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 503.27 139" style="
    fill: white;
    height: 42px;
    padding-left: 10px;
">
                <g>
                    <path d="M16.44,47.05c2.89-5.94,10.05-9.74,16.44-9.74c4.26,0,7.76,3.5,7.76,7.76s-3.5,7.76-7.76,7.76
c-10.5,0-16.44,6.7-16.44,16.9v31.66c0,4.57-3.65,8.22-8.22,8.22S0,105.96,0,101.39v-55.1c0-4.57,3.65-8.22,8.22-8.22
s8.22,3.65,8.22,8.22V47.05z"></path>
                    <path d="M73.83,37.16c25.73,0,30.45,19.79,30.45,30.29c0,5.63,0,12.18-9.29,12.18h-37.6c0,10.96,7.76,15.98,17.81,15.98
c6.7,0,11.42-2.28,15.07-4.72c1.67-1.07,2.89-1.67,4.87-1.67c3.96,0,7.15,3.2,7.15,7.15c0,2.44-1.22,4.41-2.59,5.63
c-2.59,2.44-10.66,8.37-24.51,8.37c-21.16,0-34.25-11.42-34.25-36.84C40.95,50.25,53.13,37.16,73.83,37.16z M57.84,65.93h30.14
c0-7.46-4.26-14.77-14.16-14.77C65,51.16,58.61,56.19,57.84,65.93z"></path>
                    <path d="M218.45,63.65v38.06c0,4.57-3.65,7.92-8.22,7.92c-4.87,0-8.22-3.35-8.22-7.92V66.69c0-8.68-3.5-14.61-13.4-14.61
c-10.96,0-15.22,5.94-15.22,14.46v35.17c0,4.57-3.65,7.92-8.22,7.92c-4.87,0-8.22-3.35-8.22-7.92V66.69
c0-8.68-3.5-14.61-13.4-14.61c-11.42,0-15.22,6.7-15.22,15.68v33.95c0,4.57-3.5,7.92-8.22,7.92s-8.22-3.35-8.22-7.92V46.29
c0-4.57,3.65-8.22,8.22-8.22s8.22,3.65,8.22,8.22c2.89-4.41,9.29-9.13,19.49-9.13c12.48,0,18.72,3.96,22.53,9.89
c4.87-6.55,11.42-9.89,21.77-9.89C212.81,37.16,218.45,50.4,218.45,63.65z"></path>
                    <path d="M259.24,110.38c-20.55,0-33.34-11.72-33.34-36.54c0-24.97,12.79-36.69,33.34-36.69s33.34,11.72,33.34,36.69
C292.58,98.66,279.79,110.38,259.24,110.38z M259.24,51.16c-10.96,0-16.75,7.61-16.75,22.68c0,14.92,5.78,22.53,16.75,22.53
c10.96,0,16.75-7.61,16.75-22.53C275.99,58.77,270.2,51.16,259.24,51.16z"></path>
                    <path d="M306.13,26.5c0-4.41,3.65-8.07,8.07-8.07c4.41,0,8.07,3.65,8.07,8.07v12.79h6.85c3.81,0,6.85,3.04,6.85,6.85
c0,3.81-3.04,6.85-6.85,6.85h-6.85v36.84c0,3.5,3.04,5.48,5.78,5.48c3.96,0,7.15,3.2,7.15,7.15c0,3.96-3.2,7.16-7.15,7.16
c-13.55,0-21.92-8.68-21.92-20.7V52.99h-3.5c-3.81,0-6.85-3.04-6.85-6.85c0-3.81,3.04-6.85,6.85-6.85h3.5V26.5z"></path>
                    <path d="M373.41,37.16c25.73,0,30.45,19.79,30.45,30.29c0,5.63,0,12.18-9.29,12.18h-37.6c0,10.96,7.76,15.98,17.81,15.98
c6.7,0,11.42-2.28,15.07-4.72c1.67-1.07,2.89-1.67,4.87-1.67c3.96,0,7.15,3.2,7.15,7.15c0,2.44-1.22,4.41-2.59,5.63
c-2.59,2.44-10.66,8.37-24.51,8.37c-21.16,0-34.25-11.42-34.25-36.84C340.53,50.25,352.71,37.16,373.41,37.16z M357.43,65.93h30.14
c0-7.46-4.26-14.77-14.16-14.77C364.58,51.16,358.19,56.19,357.43,65.93z"></path>
                    <path d="M428.67,8.23v83.42c0,1.83,1.83,2.74,2.89,2.74c4.26,0,7.61,3.35,7.61,7.61s-3.35,7.61-7.61,7.61
c-11.87,0-19.33-6.7-19.33-19.49V8.22c0-4.57,3.65-8.22,8.22-8.22C425.02,0.01,428.67,3.67,428.67,8.23z"></path>
                    <path d="M462.16,103.53l-23.44-54.04c-0.3-0.76-0.61-1.83-0.61-3.2c0-4.57,3.65-8.22,8.22-8.22s6.85,3.2,7.61,5.18l16.75,42.32
l16.75-42.32c0.76-1.98,3.04-5.18,7.61-5.18s8.22,3.65,8.22,8.22c0,1.37-0.3,2.44-0.61,3.2l-28.31,63.94
c-6.7,14.92-16.29,25.57-31.51,25.57c-4.41,0-7.92-3.2-7.92-7.61s3.5-7.61,7.92-7.61C452.57,123.78,457.14,116.01,462.16,103.53z"></path>
                </g>
            </svg>


        </a>
    </div>`
        }}>
      </div>
      <div className={styles.centerConsole}>
        <h1 className={styles.h1WithoutTop}>Gather the team.</h1>
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
              onCopy={setCopied}>
              <button
                className={styles.startChatButton +' '+styles.greyBGColor}
                onClick={setCopied}
                >
                <FontAwesomeIcon className={styles.footerButtonContent} icon={faCopy} />
              </button> 
            </CopyToClipboard>
          </div>
      </div>
      <div>
        {copied?
        "copied"
        :""}
        <button
          className={styles.startChatButton +' ' + styles.redBGColor +' ' + styles.bigger}
          onClick={joinRoom}
        >
         Go to room
        </button>
        <br/>
        {copied ? <span style={{color: 'red'}}>Copied.</span> : null}
      </div>
    </div>
    <div className={styles.rightWing}>
      <h1 className={styles.biggerBigger}>Remotely</h1>
      <h2>Enter immersive room</h2>
      <h2>Simply share link to invite</h2>
      <h2>be {word}</h2>
    </div>
    <div className={styles.footerBar}>
      <div className={styles.footerBarLeftContent}>
        <button className={styles.footerButton + ' ' + styles.discordBlue} onClick={toDiscord}>
          <FontAwesomeIcon className={styles.footerButtonContent} icon={faDiscord} />
        </button>
        <button className={styles.footerButton+ ' ' +  styles.youtubeRed} onClick={toYoutube}>
          <FontAwesomeIcon className={styles.footerButtonContent} icon={faYoutube} />
        </button>
        <span className={styles.footerCenter}>community</span>
      </div>
      <div></div>
      <div className={styles.footerBarRightContent +' ' + styles.footerCenter}>
        <a href="https://www.remotelyhq.com/terms-and-conditions">terms & conditions</a><span>&nbsp;&nbsp;&nbsp;</span>
        <a href="https://www.remotelyhq.com/privacy-policy">privacy policy</a><span>&nbsp;&nbsp;</span>
        <a href="https://remotelyhq.com">about us</a><span>&nbsp;&nbsp;&nbsp;</span>
        <span>© RemotelyHQ {currentYear()}</span>
      </div>
    </div>
  </div>
  )
}

export default LandingPage
