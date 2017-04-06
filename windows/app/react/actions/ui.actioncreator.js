import AppDispatcher, {Constants} from '../dispatcher/app.dispatcher.js'
import ServerAPI from '../utils/serverAPI.js'
import SecurityAPI from '../utils/securityAPI.js'
import {ipcRenderer} from 'electron'

class UIActionCreator {
    serverConnect(options) {
        AppDispatcher.handleUIAction({
            type: Constants.CONNECT,
            payload: options
        })
        ServerAPI.connect(options)
    }

    sendMsg(msg) {
        AppDispatcher.handleUIAction({
            type: Constants.MSG,
            payload: msg
        })               
        ServerAPI.write({...msg})
    }

    generateKey(params) {
        AppDispatcher.handleUIAction({
            type: Constants.GENERATE_KEY,
            payload: params
        })
        SecurityAPI.generateKey(params.secret, params.clientID)
            .then(key => {
                AppDispatcher.handleUIAction({
                    type: Constants.GENERATE_KEY_DONE,
                    payload: {
                        clientID: params.clientID,
                        key: key}
                })
            }).catch(err => { 
                alert(err.message)
                AppDispatcher.handleUIAction({
                    type: Constants.GENERATE_KEY_DONE,
                    payload: {
                        clientID: params.clientID,
                        key: null}
                })                
            })
    }

    deleteKey(params) {
        AppDispatcher.handleUIAction({
            type: Constants.DELETE_KEY,
            payload: params
        })        
    }

    loadAsymmKeys() {
        ipcRenderer.send('toggle-load-keys-window')
        ipcRenderer.once('load-asymm-keys', () => {
            AppDispatcher.handleUIAction({
                type: Constants.LOAD_ASYM_KEYS,
                payload: {}
            })  
        })

        ipcRenderer.once('asymm-keys-loaded', (event, arg) => {
            AppDispatcher.handleUIAction({
                type: Constants.LOAD_ASYM_KEYS_DONE,
                payload: {
                    privateKey: arg ? arg[0] : null,
                    publicKey: arg ? arg[1] : null
                }
            })        
        })        
    }
}

const uiActionCreator = new UIActionCreator()

export default uiActionCreator