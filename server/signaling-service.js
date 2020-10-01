const uuidv4 = require('uuid/v4')
const moment = require('moment-timezone');

var order = 0;

class SignalingService {
  constructor (wsClients) {
    this.wsClients = wsClients
  }

  send (ws, data) {
    ws.send(JSON.stringify(data))
  }

  sendToPeer (type, ws, payload) {
    const { peerId } = payload

    this.wsClients.forEach((wsClient) => {
      if (wsClient.uid === peerId) {
        this.send(wsClient, {
          type,
          payload: {
            peerId: ws.uid,
            order: ws.order,
            userName: ws.userName,
            [type]: payload[type]
          }
        })
      }

      console.info(`[Send] '${ws.uid}'  USERNAME: '${ws.userName}' sent '${type}' to user '${peerId}'`)
    })
  }

  broadcastToRoomPeers (type, ws, payload, includeSelf) {
    if(type === 'update'){    
      if(payload && payload.user && payload.user.uid && payload.user.userName){
        ws.userName = payload.user.userName;
      }
    }
    this.wsClients.forEach((wsClient) => {
      if (wsClient.roomName === ws.roomName && (includeSelf || wsClient.uid !== ws.uid)) {
        this.send(wsClient, {
          type,
          payload: {
            peerId: ws.uid,
            order: ws.order,
            userName: ws.userName,
            roomName: ws.roomName,
            roomTime: ws.roomTime,
            timestamp: new Date(),
            ...payload
          }
        });
        console.info(`[Broadcast] '${ws.uid}' '${ws.order}'  USERNAME: '${ws.userName}' broadcasted '${type}' to all peers in room '${ws.roomName}'. With room time '${ws.roomTime}'`)
      }
    })
  }

  onMessage (ws, message) {
    const { type, payload } = JSON.parse(message)

    this[`onClient${type[0].toUpperCase() + type.slice(1)}`](ws, payload)
  }
  onClientJoin (ws, payload) {
    const { uid, userName, roomName } = payload

    // Store the client
    ws.uid = uid || uuidv4();
    ws.order = (order++);
    ws.userName = userName;
    ws.roomName = roomName;
    ws.roomTime = moment().tz("UTC").format();
    console.log(`[Client Join] UID: '${ws.uid}' ORDER: '${ws.order}' USERNAME: '${ws.userName}'  ROOMNAME: '${ws.roomName}' ROOMTIME: '${ws.roomTime}'`)

    //Get room time from first person, or anyone else (who would have had to get it from the first person)
    this.wsClients.forEach((wsClient) => {
        if (wsClient.roomName === ws.roomName && wsClient.uid != ws.uid){
          ws.roomTime = wsClient.roomTime;
          return;
        }
      });

    // Send vaild uid back to client
    this.send(ws, {
      type: 'joined',
      payload: {
        uid: ws.uid,
        order: (order++),
        userName: ws.userName,
        roomName: ws.roomName,
        roomTime: ws.roomTime,
      }
    })

    this.broadcastToRoomPeers('peer joined', ws)
  }

  onClientOffer (ws, payload) {
    this.sendToPeer('offer', ws, payload)
  }

  onClientAnswer (ws, payload) {
    this.sendToPeer('answer', ws, payload)
  }

  onClientCandidate (ws, payload) {
    this.sendToPeer('candidate', ws, payload)
  }

  onClientMessage (ws, payload) {
    this.broadcastToRoomPeers('message', ws, payload, true)
  }

  onClientUpdate (ws, payload) {
    this.broadcastToRoomPeers('update', ws, payload, false)
  }
  onClientPacket (ws, payload) {
    this.broadcastToRoomPeers('packet', ws, payload, false)
  }

  onClientLeave (ws) {
    this.broadcastToRoomPeers('peer left', ws, {}, false)
  }
}

module.exports = SignalingService
