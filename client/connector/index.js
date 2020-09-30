import { log } from '../utils'
const axios = require('axios');
const openQueue = [];
class Connector {
  constructor (roomname, actions, store) {
    this.roomname = roomname;
    this.actions = actions
    this.store = store
  }

  async connect () {
    let self= this;
    let res = "";
    await axios({method:'post',
      url: process.env.MEETING_SERVICE_URL + "/api/FindServer",
      data:{
        meetingRoomID: self.roomname 
      },
      headers:{'content-type':'application/json'}
    })
    .then(function (response) {
      // handle success
      res = response;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      console.log("Trying again....");
      this.connect();
      return;
    })
    if(!res) return;
    this.url = res.data.replace('http', 'ws');
    this.ws = new WebSocket(this.url)
    const u = this.getUser();

    this.ws.addEventListener('open', () => {
      log('Signaling server connection success')
      this.actions.setChatRoomReady(true)
      while (openQueue.length > 0) {
        this.ws.send(openQueue.shift());
      }
    })

    this.ws.addEventListener('close', () => {
      log('Websocket is closed, reconnecting...')
      this.connect()
      this.joinRoom()
    })

    this.ws.addEventListener('error', () => {
      log('Signaling server connection fail')
    })

    this.ws.addEventListener('message', ({ data }) => {
      const { type, payload } = JSON.parse(data)

      switch (type) {
        case 'joined': {
          this.handleJoined(payload)
          break
        }
        case 'peer joined': {
          this.handlePeerJoined(payload)
          break
        }
        case 'peer left': {
          this.handlePeerLeft(payload)
          break
        }
        case 'offer': {
          this.handleOffer(payload)
          break
        }
        case 'offer failed': {
          this.handleOfferFailed(payload)
          break
        }
        case 'answer': {
          this.handleAnswer(payload)
          break
        }
        case 'candidate': {
          this.handleCandidate(payload)
          break
        }
        case 'update': {
          this.handleUpdate(payload)
          break
        }
        case 'message': {
          this.handleMessage(payload)
          break
        }
        case 'packet':{
          this.handlePacket(payload);
          break;
        }
        default: {
          break
        }
      }
    })

    return this.ws
  }

  send (data) {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      openQueue.push(JSON.stringify(data));
    }
  }

  getUser () {
    return this.store.getState().user
  }

  getClient (id) {
    return this.store.getState().clients.get(id)
  }

  getPeerConnection (peerId, userName) {
    const peerConn = new RTCPeerConnection({
      iceServers: [{
        urls: [
          'stun:stun.l.google.com:19302'
        ]
      }]
    })

    peerConn.addEventListener('icecandidate', ({ candidate }) => {
      if (candidate) {
        this.send({
          type: 'candidate',
          payload: {
            peerId,
            candidate
          }
        })

        log(`Sent ICE candidate to ${userName} (${peerId})`)
      }
    })

    peerConn.addEventListener('track', async ({ streams }) => {
      log(`Received remote stream from '${userName}' (${peerId})`)
      if(streams[0] === undefined || streams === null){
        const offer = await peerConn.createOffer()

        await peerConn.setLocalDescription(offer)

        this.send({
          type: 'offer',
          payload: {
            peerId,
            offer
          }
        })
      }else{
        // Update peer's stream when receiving remote stream
        this.actions.setClient({ uid: peerId, stream: streams[0] })
      }
    })

    peerConn.addEventListener('error', () => {
      log('Error when creating RTCPeerConnection')
    })

    // Add peer before remote stream arrival
    this.actions.setClient({ uid: peerId, userName, peerConn })

    return peerConn
  }

  getUserMedia () {
    if (this.stream) {
      return this.stream
    }

    // Create self-view stream if it doesn't exist
    this.stream = navigator.mediaDevices.getUserMedia({ audio: true })

    return this.stream
  }

  handleJoined ({ uid,order, userName, roomName, roomTime }) {
    log(`User '${userName}' (${uid},${order}) has joined room '${roomName}' ${roomTime}`)
    window.sendtoiframe("RoomID",[roomName, roomTime, uid +"", order,userName]);
    window.sendtoiframe("NameChange",[uid +"",userName]);
    this.actions.setUser({ uid, userName, roomName })
  }

  async handlePeerJoined ({ peerId,order, userName, roomName, roomTime }) {
    // If peer connection has established, we skip the negotiation process
    if (this.getClient(peerId)) {
      return
    }

    window.sendtoiframe("Join",[peerId +"", order,userName]);
    log(`New peer '${userName}' (${peerId}, ${order}) joined room '${roomName}' with room time '${roomTime}'`)

    const peerConn = this.getPeerConnection(peerId, userName)

    peerConn.addEventListener('negotiationneeded', async () => {
      const offer = await peerConn.createOffer()

      await peerConn.setLocalDescription(offer)

      this.send({
        type: 'offer',
        payload: {
          peerId,
          offer
        }
      })

      log(`Sent offer to '${userName}' (${peerId})`)
    })

    const stream = await this.getUserMedia()
    this.actions.setUser({ stream })

    stream.getTracks().forEach((track) => peerConn.addTrack(track, stream))

    log(`Sent local stream to remote user '${userName}' (${peerId})`)
  }
  async handleOfferFailed ({ peerId,order, userName, roomName, roomTime }) {
    // If peer connection has established, we skip the negotiation process
    if (this.getClient(peerId)) {
      return
    }
    log(`New peer '${userName}' (${peerId}, ${order}) joined room '${roomName}' with room time '${roomTime}'`)

    const peerConn = this.getPeerConnection(peerId, userName)

    peerConn.addEventListener('negotiationneeded', async () => {
      const offer = await peerConn.createOffer()

      await peerConn.setLocalDescription(offer)

      this.send({
        type: 'offer',
        payload: {
          peerId,
          offer
        }
      })

      log(`Sent offer to '${userName}' (${peerId})`)
    })

    const stream = await this.getUserMedia()
    this.actions.setUser({ stream })

    stream.getTracks().forEach((track) => peerConn.addTrack(track, stream))

    log(`Sent local stream to remote user '${userName}' (${peerId})`)
  }

  async handleOffer ({ peerId, order, userName, offer }) {
    log(`Received offer from '${userName}' (${peerId})`)

    const peerConn = this.getPeerConnection(peerId, userName)

    await peerConn.setRemoteDescription(new RTCSessionDescription(offer))

    const stream = await this.getUserMedia()
    this.actions.setUser({ stream })

    stream.getTracks().forEach((track) => peerConn.addTrack(track, stream))

    log(`Sent local stream to remote user '${userName}' (${peerId})`)

    const answer = await peerConn.createAnswer()

    await peerConn.setLocalDescription(answer);

    window.sendtoiframe("Join",[peerId +"",order,userName]);

    this.send({
      type: 'answer',
      payload: {
        peerId,
        answer
      }
    })

    log(`Sent answer to '${userName}' (${peerId})`)
  }

  async handleAnswer ({ peerId,order, userName, answer }) {
    log(`Received answer from '${userName}' (${peerId})`)

    await this.getClient(peerId).peerConn.setRemoteDescription(new RTCSessionDescription(answer))
  }

  async handleCandidate ({ peerId,order, userName, candidate }) {
    log(`Received ICE candidate from '${userName}' (${peerId})`)

    await this.getClient(peerId).peerConn.addIceCandidate(new RTCIceCandidate(candidate))
  }

  async handlePacket ({ peerId, data }) {
    window.sendtoiframe("Packet",[peerId +"",data]);
  }

  handleMessage ({ peerId,order, message, timestamp }) {
    this.actions.addMessage(peerId, message, timestamp)
  }

  handleUpdate ({ user: { uid, userName } }) {
    window.sendtoiframe("NameChange",[uid +"",userName]);
    
    this.actions.setClient({ uid, userName })
  }

  handlePeerLeft ({ peerId, userName }) {
    log(`Peer '${userName}' (${peerId}) has left`)
    window.sendtoiframe("Leave",[peerId +"",userName]);
    this.actions.deleteClient(peerId)
  }

  joinRoom () {
    const { uid, userName, roomName } = this.getUser() || {}

    this.send({
      type: 'join',
      payload: {
        uid,
        userName,
        roomName
      }
    })
  }

  leaveRoom () {
    const { user: { uid, userName, roomName } } = this.store.getState()

    this.send({
      type: 'leave',
      payload: {
        uid
      }
    })

    if (roomName) {
      // Store user data in localStorage for next time visit
      window.localStorage.setItem(roomName, JSON.stringify({
        uid,
        userName,
        roomName
      }))
    }

    this.actions.setUser({})

    this.store.getState().clients.forEach((client) => {
      if (client.peerConn) {
        client.peerConn.close()
      }
    })
  }

  sendMessage (message) {
    this.send({
      type: 'message',
      payload: {
        message
      }
    })
  }

  sendUpdate (user) {
    const u = this.getUser();
    window.sendtoiframe("NameChange",[u.uid +"",u.userName]);
    this.send({
      type: 'update',
      payload: {
        user
      }
    })
  }
  sendPacket (payload){
    const user = this.getUser();
    this.send({
      type:'packet',
      payload:{'peerId':user.uid,'data':payload}
    })
  }

  toggleMediaStream (uid) {
    const user = this.getUser()
    const { stream } = uid === user.uid ? user : this.getClient(uid)
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled
  }
}

export default Connector
