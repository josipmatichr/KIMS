import BaseStore from './base.store.js'
import AppDispatcher, {Constants} from '../dispatcher/app.dispatcher.js'

class AppStore extends BaseStore {
    constructor() {
        super(AppDispatcher)
    }

    setInitState() {
        return {
            connected: false,
            connecting: false,
            nickname: null,
            error: null            
        }
    }

    reduce(state, action) {   
        switch(action.type) {
            case Constants.CONNECT:                
                return {
                    ...state,
                    connected: false, 
                    connecting: true,
                    error: null}                 

            case Constants.CONNECTED:
                return {
                    ...state,
                    connected: true,
                    connecting: false,
                    nickname: action.payload.nickname
                }                

            case Constants.ERROR:
                return {
                    ...state,
                    connected: false,
                    connecting: false,                    
                    error: action.payload.error
                }

            default:
                return state                
        }
    }
}

const appStore = new AppStore()

export default appStore