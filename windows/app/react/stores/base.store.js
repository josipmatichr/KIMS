import {EventEmitter} from 'events'
import {Constants} from '../dispatcher/app.dispatcher.js'

/** 
 * BaseStore class should be extended by all app stores.
 * Subclasses should also override the two marked methods. 
 */
class BaseStore extends EventEmitter {
    constructor(dispatcher) {  
        super() 
        this._state = this.setInitState()
        this._dispatchToken = dispatcher.register( action => {
            action.action.source = action.source
            this._onDispatch(action.action)
        })
    }

    getDispatchToken() {
        return this._dispatchToken
    }

    // Override this method in the subclass.
    setInitState() {
        return null        
    }

    getState() {
        return this._state
    }

    // Override this method in the subclass.
    reduce(state, action) {
        return state                
    }

    addChangeListener(listener) {
        this.on(Constants.CHANGE, listener)
    }

    removeChangeListener(listener) {
        this.removeListener(Constants.CHANGE, listener)
    }

    _areEqual(before, after) {
        return before === after
    }

    _emitChange() {
        this.emit(Constants.CHANGE)        
    }   

    _onDispatch(action) {
        const stateBefore = this._state
        const stateAfter = this.reduce(stateBefore, action)
        if (!this._areEqual(stateBefore, stateAfter)) {            
            this._state = stateAfter
            this._emitChange()
        }        
    }     
}

export default BaseStore