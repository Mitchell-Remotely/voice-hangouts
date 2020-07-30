import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Actions from '../../actions'
import styles from './MeetingEnd.css'

function MeetingEnd ({
}) {
  const [Rate, setRate] = React.useState('');
  const [Features, setFeatures] = React.useState('');
  const [Environments, setEnvironments] = React.useState('');
  const [Feedback, setFeedback] = React.useState('');
  const [DisplayError, setDisplayError] = React.useState('');
  let model = {
    "body":"",
    "subject":"Feedback",
    "answers":[]
  }
  async function submitFeedback () {
    setDisplayError("");
    if(!Rate && !Features && !Environments && !Feedback){
      //nothing
    }else{
      model.body = Feedback;
      model.answers.push(Rate);
      model.answers.push(Features);
      model.answers.push(Environments);
      let xhr = new XMLHttpRequest();
      let url = "https://fa-analytics-service.azurewebsites.net/api/Feedback"; 
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(model) // body data type must match "Content-Type" header
      }).then(data => {
        if(data.status == 200){
          clearFields();
          setDisplayError("Feedback submitted successfully")
        }
      });
    }
  }
  function clearFields(){
    model = {
      "body":"",
      "subject":"Feedback",
      "answers":[]
    };
    setRate('');
    setFeatures('');
    setEnvironments('');
    setFeedback('');
  }
  return (
    <div className={styles.meetingend}>
      <div className={styles.center}>
        <h1>We hope you enjoyed our meeting room.</h1>
      </div>
      <div className={styles.grid}>
        <div className={styles.center}>
          <div className={styles.label}>Rate this meeting. ?/10</div>
          <input placeholder="10" value={Rate} onChange={e => setRate(e.target.value)}></input>
        </div>
        <div className={styles.center}>
          <div className={styles.label}>What features would you like to see?</div>
          <input placeholder="Interactable environment" value={Features} onChange={e => setFeatures(e.target.value)}></input>
        </div>
        <div className={styles.center}>
          <div className={styles.label}>What other environments would you like to see?</div>
          <input placeholder="Space cowboys" value={Environments} onChange={e => setEnvironments(e.target.value)}></input>
        </div>
        <div className={styles.center}>
          <div className={styles.label}>Any other feedback? Give us your thoughts.</div>
          <textarea rows="10" placeholder="I would love it if I could customize my character." value={Feedback} onChange={e => setFeedback(e.target.value)}></textarea>
        </div>
      </div>
      <div className={styles.grid}>
        <button className={styles.endButton} onClick={submitFeedback}>
          Submit feedback
        </button>
        {!DisplayError ? ('') :(<div><span color="red">{DisplayError}</span></div>)}
      </div>
    </div>
  )
}

MeetingEnd.propTypes = {
  connector: PropTypes.object.isRequired,
}

export default connect(
  state => ({
  }),
  dispatch => ({
  })
)(MeetingEnd)
