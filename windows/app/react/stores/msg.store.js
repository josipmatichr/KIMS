import BaseStore from './base.store.js'
import AppDispatcher, {Constants} from '../dispatcher/app.dispatcher.js' 

class MsgStore extends BaseStore {
    constructor() {
        super(AppDispatcher)
    }

    setInitState() {
        return {
            messages: []}
    }

    reduce(state, action) {                     
        const { clientID, nickname, clients, content, timestamp, secret } = action.payload
        switch(action.type) {
            case Constants.TYPE_INIT: 
                const message = {
                    clientID: 'SERVER',
                    nickname: nickname,
                    content: content,
                    timestamp: timestamp}                    
                return {
                    ...state, 
                    messages: [...state.messages, message]}

            case Constants.MSG:
                const msg = action.payload                
                return {
                    ...state, 
                    messages: [...state.messages, msg]}

            case Constants.ERROR:
                return {
                    messages: []}    

            default:
                return state                
        }
    }
}

const msgStore = new MsgStore()

export default msgStore