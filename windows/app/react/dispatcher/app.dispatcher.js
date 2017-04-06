import Dispatcher from 'flux'

const Constants = {
    UI_ACTION: 'UI_ACTION',
    SERVER_ACTION: 'SERVER_ACTION',
    CONNECT: 'CONNECT',
    CONNECTED: 'CONNECTED',
    ERROR: 'ERROR',
    CHANGE: 'change',
    MSG: 'MSG',
    TYPE_INIT: 'TYPE_INIT',
    TYPE_CLIENT_JOINED: 'TYPE_CLIENT_JOINED',
    TYPE_CLIENT_LEFT: 'TYPE_CLIENT_LEFT',
    GENERATE_KEY: 'GENERATE_KEY',
    GENERATE_KEY_DONE: 'GENERATE_KEY_DONE',
    DELETE_KEY: 'DELETE_KEY',
    LOAD_ASYM_KEYS: 'LOAD_ASYM_KEYS',
    LOAD_ASYM_KEYS_DONE: 'LOAD_ASYM_KEYS_DONE'
}

class AppDispatcher extends Dispatcher.Dispatcher {
    constructor() {
        super()
    }

    handleUIAction(action) {
        this.dispatch({
            source: Constants.UI_ACTION,
            action: action
        })                
    }

    handleServerAction(action) {
        this.dispatch({
            source: Constants.SERVER_ACTION,
            action: action
        })
    }
}

const appDispatcher = new AppDispatcher()

export { appDispatcher as default, Constants }