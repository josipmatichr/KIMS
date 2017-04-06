import BaseStore from './base.store.js'
import AppDispatcher, {Constants} from '../dispatcher/app.dispatcher.js'
import {ipcRenderer as ipc} from 'electron'

class ClientsStore extends BaseStore {
    constructor() {
        super(AppDispatcher)
    }

    setInitState() {
        return {
            nickname: null,
            clientID: null,
            secret: null,
            key: null,
            keysAsymm: {},
            clients: {}}
    }

    reduce(state, action) {
        const { 
            clientID, 
            nickname, 
            clients, 
            secret, 
            key,
            privateKey,
            publicKey } = action.payload

        switch(action.type) {
            case Constants.CONNECTED:
                return {                    
                    ...state,
                    nickname: nickname} 

            case Constants.TYPE_INIT: 
                return {
                    ...state,                    
                    clientID: clientID,
                    clients: clients}

            case Constants.TYPE_CLIENT_JOINED:
                let client = {}
                client[clientID] = {nickname: nickname}                  
                ipc.send('notify', {
                     title: 'User joining',
                     text: `User  ${nickname} has joined the chatroom.`
                })                                       
                return {
                    ...state,
                    clients: {...state.clients, ...client}}

            case Constants.TYPE_CLIENT_LEFT:
                let clientsAfter = {...state.clients}
                delete clientsAfter[clientID]  
                ipc.send('notify', {
                     title: 'User leaving',
                     text: `User ${state.clients[clientID].nickname} has left the chatroom.`
                })                       
                return {
                    ...state,
                    action: Constants.TYPE_CLIENT_LEFT,
                    clients: clientsAfter}

            case Constants.GENERATE_KEY:
                // Local client
                if (state.clientID === clientID) {
                    return {                        
                        ...state,
                        secret: secret,
                        key: Constants.GENERATE_KEY} // Tell UI to show a spinner.
                // Remote client    
                } else {
                    let clientsAfter = {...state.clients}
                    clientsAfter[clientID].secret = secret
                    clientsAfter[clientID].key = Constants.GENERATE_KEY // Tell UI to show a spinner.                    
                    return {
                        ...state,
                        clients: clientsAfter}
                }

            case Constants.GENERATE_KEY_DONE: 
                // Local client
                if (state.clientID === clientID) {
                    return {
                        ...state,
                        key: key}
                // Remote client     
                } else {
                    let clientsAfter = {...state.clients}
                    clientsAfter[clientID].key = key
                    return {
                        ...state,
                        clients: clientsAfter}
                }

            case Constants.DELETE_KEY:                               
                // Local client
                if (state.clientID === clientID) {
                    return {
                        ...state,
                        secret: null,
                        key: null}
                        
                // Remote client    
                } else {
                    let clientsAfter = {...state.clients}
                    clientsAfter[clientID].secret = null
                    clientsAfter[clientID].key = null
                    return {
                        ...state,
                        clients: clientsAfter}
                }

            case Constants.LOAD_ASYM_KEYS:
                return {
                    ...state,
                    publicKey: Constants.LOAD_ASYM_KEYS // Tell UI to show a spinner.
                }

            case Constants.LOAD_ASYM_KEYS_DONE:     
                return {
                    ...state,
                    privateKey: privateKey,
                    publicKey: publicKey}

            case Constants.ERROR:
                return {
                    nickname: null,
                    clientID: null,
                    secret: null,
                    key: null,
                    keysAsymm: {},                    
                    clients: {}}    

            default:
                return state    
        }                    
    }
}

const clientsStore = new ClientsStore()

export default clientsStore