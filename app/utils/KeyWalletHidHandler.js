import HID from 'node-hid';
import KeyWalletDevice from './KeyWalletDevice.js';

const KEYWALLET_VID = 9720;

const onDataReceived = (data) => {
  console.log('data: ', data);
}

const onErrorReceived = (data) => {
  console.log('error: ', data);
}

class KeyWallet {
  constructor(device) {
    this._device = device;
    this._device.on("data", onDataReceived);
    this._device.on("error", onErrorReceived);
  }

  sendData = (data) => {
    return new Promise((resolve, reject) => {
      try {
        this._device.write(data);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  close = () => {
    return new Promise((resolve) => {
      this._device.close();
      resolve();
    });
  }
}

export function getDeviceList () {
  let deviceList = [];
  let keywalletPro;
  let keywalletClassic;
  let keywalletReader;
  
  try {
    keywalletPro = new HID.HID(9720, 16);
  } catch (error) {
    keywalletPro = null;
    console.log('keywalletPro not found');
  }

  try {
    keywalletClassic = new HID.HID(9720, 17);
  } catch (error) {
    keywalletClassic = null;
    console.log('keywalletClassic not found');
  }

  try {
    keywalletReader = new HID.HID(9720, 18);
  } catch (error) {
    keywalletReader = null;
    console.log('keywalletReader not found');
  }

  if (keywalletPro) {
    deviceList.push({name: 'KeyWallet Pro', device: new KeyWallet(keywalletPro)});
  }
  if (keywalletClassic) {
    deviceList.push({name: 'KeyWallet Classic', device: new KeyWallet(keywalletClassic)});
  }
  if (keywalletReader) {
    deviceList.push({name: 'KeyWallet Reader', device: new KeyWallet(keywalletReader)});
  }

  return deviceList;
}

class KeyWalletHidHandler {
  getDevices = () => {
    return new Promise((resolve) => {
      const devices = HID.devices();
      const keywallets = devices.filter((device) => {
        return (device.vendorId == KEYWALLET_VID);
      });
  
      resolve(keywallets);
    });
  }
  
  connect = (device, onDeviceAttached, onDeviceDetached) => {
    return new Promise((resolve) => { 
      try {
        const keywallet = new KeyWalletDevice(device, onDeviceDetached);
        onDeviceAttached(keywallet);
        resolve(true);
      } catch(error) {
        resolve(false);
      }
    });
  }
}

const keywalletHidHandler = new KeyWalletHidHandler();
export default keywalletHidHandler;

