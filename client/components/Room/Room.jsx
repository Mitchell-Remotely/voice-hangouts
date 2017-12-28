import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Actions from '../../actions';

import styles from './Room.css';

class Room extends React.PureComponent {
  static propTypes = {
    connector: PropTypes.object.isRequired,
    clients: PropTypes.object.isRequired,
    chatRoomReady: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    addMessage: PropTypes.func.isRequired,
    toggleUserAudio: PropTypes.func.isRequired,
  };

  state = {
    message: '',
  };

  onEditUserName = () => {
    const { connector, setUser, user } = this.props;
    let userName = window.prompt('Edit your username:', this.props.user.userName);
    setUser({ userName });
    connector.sendUpdate({ uid: user.uid, userName });
  }

  onInputChange = (evt) => {
    const { target: { name, value } } = evt;
    this.setState({ [name]: value });
  }

  onSendMessage = (evt) => {
    const { key, type } = evt;
    const { message } = this.state;
    const { addMessage, connector, user } = this.props;

    if ((key === 'Enter' || type === 'click') && message) {
      connector.sendMessage(message);
      this.setState({ message: '' });
    }
  }

  onUserControlClick = ({ target }) => {
    const { connector, user } = this.props;
    const { uid } = target.dataset;

    if (uid === user.uid) {
      connector.toggleMediaStream();
    }

    this.props.toggleUserAudio(uid);
  }

  getUserControlIcon = (uid, mute) => {
    if (this.props.user.uid === uid) {
      return !mute ? '\u{1F3A4}' : '\u{1F6AB}';
    }

    return !mute ? '\u{1F50A}' : '\u{1F507}';
  }

  getUserName = (uid) => {
    const { clients, user } = this.props;
    if (uid === user.uid) {
      return user.userName;
    }

    const client = clients.get(uid);
    return client ? client.userName : 'Guest';
  }

  isUrl(url) {
    return /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig.test(url);
  }

  render() {
    const { chatRoomReady, clients, messages, user } = this.props;
    const { message } = this.state;
    const users = [user, ...Array.from(clients.values())].filter(user => user.uid);

    return (
      <div className={ styles.room }>
        <div className={ styles.userList }>
          <h3>Voice Hangouts</h3>
          {
            users.map((user) => (
              <div key={ user.uid } className={ styles.userListRow }>
                <button
                  className={ styles.userControlIcon }
                  onClick={ this.onUserControlClick }
                  data-uid= { user.uid }
                  data-mute={ user.mute }
                >
                  { this.getUserControlIcon(user.uid, user.mute) }
                </button>
                <span className={ styles.userListName }>{ user.userName }</span>
              </div>
            ))
          }
        </div>
        <div className={ styles.chatRoom }>
          <div className={ styles.messages }>
            {
              messages.map((msg) =>
                (
                  <div key={ msg.mid } className={ styles.messageRow }>
                    <span>
                      <span className={ styles.messageUser }>
                        { `${this.getUserName(msg.uid)}:` }
                      </span>
                      <span>
                        {
                          !this.isUrl(msg.message) ?
                            msg.message
                          :
                            <a target="_blank" href={ msg.message }>{ msg.message }</a>
                        }
                      </span>
                    </span>
                    <span
                      className={ styles.timestamp }
                      title={ msg.timestamp.toLocaleDateString() }
                    >
                      { `${msg.timestamp.toLocaleTimeString()}` }
                    </span>
                  </div>
                ),
              )
            }
          </div>
          <div className={ styles.messageBox } disabled={ !chatRoomReady }>
            <div
              className={ styles.userNameBox }
              title="Click to edit your name"
              onClick={ this.onEditUserName }
            >
              <span className={ styles.userName }>{ user.userName }</span>
            </div>
            <input
              autoFocus
              className={ styles.messageInput }
              disabled={ !chatRoomReady }
              name="message"
              placeholder="type message here..."
              value={ message }
              onChange={ this.onInputChange }
              onKeyPress={ this.onSendMessage }
            />
            <input
              className={ styles.sendButton }
              disabled={ !chatRoomReady }
              type="submit"
              value="Send"
              onClick={ this.onSendMessage }
            />
          </div>
        </div>
        {
          Array.from(clients).filter(([, peer]) => peer.stream).map(([id, peer]) => (
            <audio
              key={ id }
              autoPlay
              src={ peer.stream }
            />
          ))
        }
      </div>
    );
  }
}

export default connect(
  (state) => ({
    clients: state.clients,
    chatRoomReady: state.chatRoomReady,
    messages: state.messages,
    user: state.user,
  }),
  (dispatch) => ({
    addMessage: (userName, message) => dispatch(Actions.addMessage(userName, message)),
    setUser: (payload) => dispatch(Actions.setUser(payload)),
    toggleUserAudio: (uid) => dispatch(Actions.toggleUserAudio(uid)),
  }),
)(Room);
