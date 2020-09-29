import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import volumeMeter from 'volume-meter'
import styles from './VolumeMeter.css'

function VolumeMeter ({uid, enabled, stream }) {
  const [volume, setVolume] = useState(0)
  var lastVolume = 0;
  var self = this;
  var volumeHook= function(v){
    var rounded = Math.round(v);
    if(!enabled){
      window.sendtoiframe("Volume",[uid +"",0]);
      lastVolume = 0;
      setVolume(0);
    }
    if(lastVolume != rounded && ((rounded > lastVolume + 5 || rounded < lastVolume - 5) || rounded === 0)){
      window.sendtoiframe("Volume",[uid +"",v]);
      lastVolume = rounded;
      setVolume(v);
    }
    return;
  }
  useEffect(
    () => {
      if (!enabled) {
        volumeHook(0)
        return
      }

      const audioContext = new AudioContext()
      const meter = volumeMeter(
        audioContext,
        { tweenIn: 2, tweenOut: 6 },
        volumeHook
      )
      audioContext.createMediaStreamSource(stream).connect(meter)

      return () => {
        audioContext.close()
        meter.stop()
      }
    },
    [enabled, stream]
  );

  return (
    <svg className={styles.volumeMeter} width={`${volume}px`}>
      <polygon points='0,20 25,0 25,20' />
    </svg>
  )
}

VolumeMeter.propTypes = {
  enabled: PropTypes.bool.isRequired,
  stream: PropTypes.object.isRequired
}

export default VolumeMeter
