import keywalletHidHandler from './KeyWalletHidHandler.js';

class KeyWalletService {
    _connectedDevice;

    getDeviceList = () => {
        return new Promise((resolve, reject) => {
            try {
                const devices = keywalletHidHandler.getDevices();
                resolve(devices);
            } catch (error) {
                reject(error);
            }
        });
    }

    connectDevice = (device) => {
        return new Promise(async (resolve) => {
            try {
                if (this._connectedDevice) {
                    resolve(false);
                    return;
                }
                const result = await keywalletHidHandler.connect(device, this._onDeviceAttached, this._onDeviceDetached);
                resolve(result);
            } catch (error) {
                resolve(false);
            }
        });
    }

    isDeviceConnectd = () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this._connectedDevice) {
                    resolve(false);
                    return;
                }
                resolve(await this._connectedDevice.isConnected());
            } catch (error) {
                reject(error);
            }
        });
    }

    getConnectedDeviceInfo = () => {
        return new Promise((resolve, reject) => {
            try {
                if (!this._connectedDevice) {
                    resolve(false);
                    return;
                }
                resolve(this._connectedDevice.device);
            } catch (error) {
                reject(error);
            }
        });
    }

    disconnectDevice = () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this._connectedDevice) {
                    resolve(true);
                    return;
                }
                const result = await this._connectedDevice.close();
                this._onDeviceDetached(this._connectedDevice.device);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    _transceiveAPDU = (cmdAPDU) => {

    }

    _onDeviceAttached = (keywallet) => {
        console.log('device attahced: ', keywallet);
        this._connectedDevice = keywallet;
    }

    _onDeviceDetached = (device) => {
        if (device.path === this._connectedDevice.device.path) {
            console.log('device detached: ', device);
            this._connectedDevice = null;
        }
    }
}

const keywalletService = new KeyWalletService();
export default keywalletService;