import Net from 'net'
import ServerActionCreator from '../actions/server.actioncreator.js'

let socket = null

const DEFAULT_SERVER = {    
    port: '6968',
    host: 'localhost'    
}

class ServerBaseAPI {
    _validateNumber(number, min, max) {      
        return number >= min && number <= max
    }

    // Override this method in the subclass. 
    onConnect(options) {
        return
    }    

    // Override this method in the subclass.
    onData(msg) {
        return
    }

    static write(data) {
        socket ? socket.write(JSON.stringify(data)) : null
    }

    connect(options) {      
        const port = options.port || DEFAULT_SERVER.port
        if (!this._validateNumber(port, 0, 65535)) {
            //throw Error('RangeError: "port" option should be >= 0 and < 65536: ' + port)
            const error = `RangeError: "port" option should be >= 0 and < 65536:  ${port}`
            ServerActionCreator.serverError({
                error: error
            })
            return            
        }

        socket = Net.connect({
            port: options.port || DEFAULT_SERVER.port,
            host: options.server || DEFAULT_SERVER.host 
        }).on('connect', () => {                
            this.onConnect(options)          
        }).on('data', (data) => {
            const msg = JSON.parse(data)
            this.onData(msg)
        }).on('error', err => {
            ServerActionCreator.serverError({
                error: err.message
            })
            socket ? socket.destroy() : null            
        })
    }
}

export {ServerBaseAPI as default, DEFAULT_SERVER}
