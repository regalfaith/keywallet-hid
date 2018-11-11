import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keywalletService from '../../utils/KeyWalletService.js';

export default class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  state = {
    username: '',
    log: 'Initial data',
  };

  device;

  testButton1 = async () => {
    const devices = await keywalletService.getDeviceList();
    this.device = devices[0];
    this.setState({
      log: 'devices: ' + devices[0],
    });
  }

  testButton2 = async () => {
    const result = await keywalletService.connectDevice(this.device);
    this.setState({
      log: 'result: ' + result,
    });
  }

  testButton3 = async () => {
    const result = await keywalletService.disconnectDevice();
    this.setState({
      log: 'result: ' + result,
    });
  }

  testButton4 = async () => {
    const result = await keywalletService.isDeviceConnectd();
    this.setState({
      log: 'result: ' + result,
    });
  }

  handleLogin = () => {
    this.props.onLogin({
      username: this.state.username,
      loggedIn: true,
    });
  };

  handleChange = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <h2>Login</h2>
        <input onChange={this.handleChange} type="text" value={this.state.username} />
        <button onClick={this.handleLogin}>Log In</button>
        <button onClick={this.testButton1}>Get list</button>
        <button onClick={this.testButton2}>Connect</button>
        <button onClick={this.testButton3}>Disconnect</button>
        <button onClick={this.testButton4}>isConnected</button>
        <div>
          <h2>{this.state.log}</h2>
        </div>
      </div>
    );
  }
}
