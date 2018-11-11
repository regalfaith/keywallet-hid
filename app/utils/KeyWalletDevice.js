import HID from 'node-hid';

export default class KeyWalletDevice {

    device;
    _keywallet;

    constructor(device, onDeviceDetached) {
        this.device = device;
        this._keywallet = new HID.HID(device.path);
        this._keywallet.on("error", () => onDeviceDetached(device));
        this._keywallet.on("data", this._onDataReceived);
    }

    _onDataReceived = (data) => {
        console.log('data: ', data);
    }

    _onDeviceDetached = (onDeviceDetached, device) => {
        return onDeviceDetached(device)
    }

    isConnected = () => {
        return new Promise((resolve) => {
            try {
                if (this._keywallet._paused) {
                    resolve(false);
                    return;
                }
                resolve(true);
            } catch(error) {
                resolve(false);
            }
        });
    }

    pause = () => {
        return new Promise((resolve) => {
            try {
                this._keywallet.pause();
                resolve(true);
            } catch(error) {
                resolve(false);
            }
        });
    }

    close = () => {
        return new Promise((resolve) => {
            try {
                this._keywallet.close();
                resolve(true);
            } catch(error) {
                resolve(false);
            }
        });
    }

    transceive = (cmdAPDU) => {
        return new Promise((resolve, reject) => {
            this._keywallet.write([0x00, 0x01, 0x01, 0x05, 0xff, 0xff]);
            resolve('0102030405060708');
        });
    }
}