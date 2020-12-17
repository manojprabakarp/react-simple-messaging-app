import React from 'react';
import io from 'socket.io-client';


class Testcomponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      textBoxText: '',
      socket: io('http://localhost:3001/', { transports: ['websocket', 'polling', 'flashsocket'] }),
      messages: [],
      user: null,
      error: null
    }

    this.init();

  }

  init = () => {
    this.state.socket.on('connect', () => {
      console.log('connected');
    });
    this.state.socket.on('newmsg', (data) => {
      let messages = this.state.messages;
      messages.push(data);
      this.setState({ messages: messages });
    });

    this.state.socket.on('userExists', (data) => {
      let state = this.state;
      state.user = null;
      state.textBoxText = data.data;
      state.error = data.data + data.msg;
      this.setState(state);
    });

    this.state.socket.on('disconnect', (data) => {
      this.state.socket.emit('diconnect', this.state.user);
    });

  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (this.state.user) {
        this.sendMessage();
      } else {
        this.setUsername();
      }
    };
  }

  changeText = (e) => {
    this.setState({ textBoxText: e.target.value });
  }

  sendMessage = () => {
    if (this.state.textBoxText !== "") {
      this.state.socket.emit('msg', { message: this.state.textBoxText, user: this.state.user });
      this.clearInputBox();
    }
  }

  clearInputBox = () => {
    this.setState({ textBoxText: "" });
  }

  setUsername = () => {
    console.log(this.state.user, this.state.textBoxText, 'setuser');
    if (this.state.textBoxText !== "") {
      this.setState({ user: this.state.textBoxText });
      this.state.socket.emit('setUsername', this.state.textBoxText);
      this.clearInputBox();
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {

    return (
      <div>
        <h3>Simple Chat App!</h3>
        <div id="chatContainer">
          {this.state.messages.map((msg, index) => {
            return <div className="messages" key={index}>{msg.message}<div className="userCont">-{msg.user}</div></div>
          })}
          <div id="bottomMsgCont" ref={(el) => { this.messagesEnd = el; }}></div>
        </div>
        <br />
        <input type="text" onChange={this.changeText} onKeyDown={this.handleKeyDown} value={this.state.textBoxText} />
        {!this.state.user && <button onClick={this.setUsername}>User Name</button>}
        {this.state.user && <button onClick={this.sendMessage}>send</button>}
        {this.state.error && !this.state.user && <div className="error">{this.state.error}</div>}
      </div>
    );
  }
}

export default Testcomponent

