import React, { Component } from 'react';
import io from 'socket.io-client';
import faker from 'faker';
import logo from './logo.svg';
import './App.css';

interface IState {
  userName: string;
  userEmail: string;
  sentences: string[];
}

class App extends Component<{}, IState> {
  public state: IState = {
    userName: '',
    userEmail: '',
    sentences: []
  };
  private socket: any;

  constructor(props: any) {
    super(props);
    this.init();
    this.userMessageHandler = this.userMessageHandler.bind(this);
    this.messageHandler = this.messageHandler.bind(this);
    this.say = this.say.bind(this);
  }

  public componentDidMount() {
    this.socket.on('user', this.userMessageHandler);
    this.socket.on('message', this.messageHandler);
  }
  public render() {
    return (
      <div className="App">
        <button type="button" onClick={this.say}>
          say
        </button>
        <div>
          <p>user name: {this.state.userName}</p>
          <p>user email: {this.state.userEmail}</p>
        </div>
        <p>messages:</p>
        <div id="sentence-box">
          {this.state.sentences.map((sentence: string, idx: number) => {
            return <p key={idx}>{sentence}</p>;
          })}
        </div>
      </div>
    );
  }

  private init() {
    const socketURI = process.env.REACT_APP_SOCKET_URI || 'http://localhost:8080';
    this.socket = io(socketURI, {
      reconnectionAttempts: 5
    });
    console.log('process.env: ', process.env);
    this.socket.on('connect', () => {
      console.log('socket id: ', this.socket.id);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('connect_error');
      console.error(error);
    });

    this.socket.on('error', (error: Error) => {
      console.error('error');
      console.error(error);
    });
  }

  private userMessageHandler(user: any) {
    console.log('user: ', user);
    this.setState((prevState) => {
      return Object.assign({}, prevState, { userName: user.name, userEmail: user.email });
    });
  }

  private messageHandler(sentence: string) {
    console.log('sentence: ', sentence);
    this.setState((prevState) => {
      const sentences = this.state.sentences.concat([sentence]);
      return Object.assign({}, prevState, { sentences });
    });
  }

  private say() {
    const message = faker.lorem.sentence();
    this.socket.emit('say', message);
  }
}

export default App;
