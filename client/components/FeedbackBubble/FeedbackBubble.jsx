import React, { useState,useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './FeedbackBubble.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/fontawesome-free-regular'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { faGrinBeam, faStar } from '@fortawesome/free-regular-svg-icons'
let answers = [];
function FeedbackBubble ({user}) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(0);
  const [internalSelected, setInternalSelected] = useState(3);
  const [preselected, setPreSelected] = useState(-1);
  const [waiting, setWaiting] = useState(false);
  const [textAreaContent, setTextAreaContent] = useState("");
  const [questions, setQuestions] = useState([
    {
      "question":"How is your Remotely experience so far?",
      "display":"number",
      "options":[0,1,2,3,4],
      "onsubmit":currentExperience
    },
    {
      "question":"How likely are you to recommend Remotely to a friend or colleague?",
      "display":"number",
      "options":[0,1,2,3,4],
      "onsubmit":reccomend
    },
    {
      "question":"Any additional comments or suggestions?",
      "display":"textarea",
      "placeholder":"Problems, new features or what you'd like to see",
      "options":[],
      "onsubmit":onCommentsSubmit
    }
  ]);
  function setCurrent(current, num){
    answers[current] = num;
    setInternalSelected(num);
  }
  function currentExperience(){
  }
  function reccomend(){
  }
  function onCommentsSubmit(){
  }

  function onSubmit(){
    questions[selected].onsubmit();
    setExpanded(false);
    setWaiting(true); 
    setTimeout(
      () => {
        if(selected + 1 < questions.length){
          setSelected(selected + 1);
          setInternalSelected(3);
          setWaiting(false); 
        }
      }, 
      200000
    );
    fetch('https://fa-analytics-service.azurewebsites.net/api/Feedback', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formatRequest()),
      });
  }
  function formatRequest(){
    let localAnswers = questions.map((obj,i)=>{
      if(answers[i] !== undefined)
        return "Question " +i +": "  + questions[i].question + " Answer " + i +": " + answers[i]
    });
    let toRet = {
      "body":"Room ID: "+ window.location.pathname.split('/')[1] + ", User ID: " + user.uid + ", UserName: " + user.userName,
      "subject":"Feedback from meetings.remotelyhq.com",
      "answers":localAnswers
    };
    return toRet;
  }
  let onTextAreaChange= (e) => {
    var text = e.target.value;
    setTextAreaContent(text);
    answers[2] =textAreaContent;
  }
  
  const listItems = questions[selected].options.map((number, i) =>
            <li className={styles.specialLi} key={number.toString()}>
              { (preselected === internalSelected ? number <= internalSelected : number <= preselected) ?
                <button className={styles.starButton + ' ' + styles.starButtonSelected}
                onMouseEnter={() =>{ 
                  setPreSelected(number);
                }}
                onMouseLeave={() =>{ 
                  setPreSelected(internalSelected);
                }}
                onClick={() => {
                  setCurrent(answers.length, number);
                }}
                >
                  <FontAwesomeIcon icon={faStarSolid} />
                </button>
              :
                <button className={styles.starButton + ' ' + styles.starButtonUnSelected}
                  onMouseEnter={() =>{ 
                    setPreSelected(number);
                  }}
                  onMouseLeave={() =>{ 
                    setPreSelected(internalSelected);
                  }}
                  onClick={() => {
                    setCurrent(answers.length, number);
                  }}>
                  <FontAwesomeIcon icon={faStar} />
                </button>
              }
            </li>
          );

  return (
    <div>
      {expanded && !waiting ?
        <div className={styles.bigContainer + ' ' + styles.rightPositioning}>
          <button className={styles.closeButton} onClick={()=>setExpanded(false)}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
          <h4 className={styles.mt0}>{questions[selected].question}</h4>
          { questions[selected].display === "number" ?
            <div>
                <ul className={styles.specialUl}>
                  { listItems }
                </ul>    
            </div>
            :
            ( questions[selected].display === "textarea" ?
            <textarea
              className={styles.Input + ' ' + styles.noResize}
              placeholder = {questions[selected].placeholder}
              rows={5}
              cols={10}
              onChange = {onTextAreaChange}
            />  
            :
            <div></div>
            )
          }
        <button className={styles.submitButton + ' ' + styles.fs18}
                  onClick={onSubmit}
                  >Submit</button>
        </div>
      :(!waiting ?
      <button className={styles.smallContainer + ' ' + styles.rightPositioning} onClick={()=>setExpanded(true)}>
        <div className={styles.rotate + ' ' + styles.feedbackClosed}>
          <FontAwesomeIcon className={styles.footerButtonContent} icon={faGrinBeam} />&nbsp;Feedback
        </div>
      </button>
      :""
      )
      }
    </div>
  )
}
FeedbackBubble.propTypes = {
  user: PropTypes.object.isRequired
}

export default FeedbackBubble
