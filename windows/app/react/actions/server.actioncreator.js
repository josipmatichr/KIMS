import AppDispatcher, {Constants} from '../dispatcher/app.dispatcher.js'

class ServerActionCreator {
    serverConnected(options) {
        AppDispatcher.handleServerAction({
            type: Constants.CONNECTED,
            payload: options
        })
    }

    serverError(error) {
        AppDispatcher.handleServerAction({
            type: Constants.ERROR,
            payload: error
        })        
    }

    serverNewMsg(msg) {
        AppDispatcher.handleServerAction({
            type: Constants.MSG,
            payload: msg
        })                
    }

    serverCtrMsg(action) {
        AppDispatcher.handleServerAction({
            type: action.type,
            payload: action.payload
        })                
    }    
}

const serverActionCreator = new ServerActionCreator()

export default serverActionCreator