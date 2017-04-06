import ServerBaseAPI from './serverBaseAPI.js'
import ServerActionCreator from '../actions/server.actioncreator.js'
import {Constants} from '../dispatcher/app.dispatcher.js'
import Utils from './utils.js'
import ClientStore from '../stores/clients.store';
import Crypto from 'crypto'
/** 
 * Control message processing functions. 
 */

var  crypto = require('crypto');

let algorithm = 'aes-128-cbc';
let iv = Crypto.randomBytes(16);
let iv_hex = iv.toString('hex');

function encrypt(text, secret) {
    console.log("iv jJEe ", iv)
    var chiper = crypto.createCipheriv(algorithm, secret, iv);
    var crypted = chiper.update(text, 'utf8', 'hex');
    crypted += chiper.final('hex');
    crypted += iv_hex;
    return crypted;
}

function decrypt(text, secret) {
    console.log("TEXT JE ", text);
    var iv_hex = text.substr(text.length - 32);
    let iv_dec = Buffer.from(iv_hex,'hex')
    console.log("iv je ", iv_dec);
    let plaintext = text.substr(0,text.length - 32 );
    var decipher = crypto.createDecipheriv(algorithm, secret, iv_dec);
    var dec = decipher.update(plaintext, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


function init(msg) {    
    ServerActionCreator.serverCtrMsg({
        type: Constants.TYPE_INIT,
        payload: msg
    })
}

function clientJoined(msg) {
    ServerActionCreator.serverCtrMsg({
        type: Constants.TYPE_CLIENT_JOINED,
        payload: msg
    })
}

function clientLeft(msg) {
    ServerActionCreator.serverCtrMsg({
        type: Constants.TYPE_CLIENT_LEFT,
        payload: msg
    })
}

function keyAgreeProt(msg) {
}

/** 
 * Regular message processing function. 
 */
function regular(msg) {
        var moj_kljuc;
        var plainMsg;
        const {clients}=ClientStore.getState()

        if(clients&&clients[msg.clientID].key)
        {
           moj_kljuc= clients[msg.clientID].key;
           plainMsg= decrypt(msg.content, moj_kljuc)
           msg.content=plainMsg;
        }
       console.log("msg", msg);
    ServerActionCreator.serverNewMsg(msg)

}
const Process = {
    0: init,
    1: clientJoined,
    2: clientLeft,
    3: keyAgreeProt
}

class ServerAPI extends ServerBaseAPI {

    _processMessage(msg) {
        Process.hasOwnProperty(msg.type) ? (            
            Process[msg.type](msg) 
        ) : (                
            regular(msg)
        )
    }    

    onConnect(options) {
        const nickname = {
            nickname: options.nickname || Utils.getRandomName()
        }
        ServerActionCreator.serverConnected(nickname)                         
        ServerBaseAPI.write(nickname)
    }    

    onData(msg) {
        this._processMessage(msg)
    }

    write(data) {
        const { key }  = ClientStore.getState();
        if (data.content){
            if(key){
            data.content = encrypt(data.content, key);
            console.log("Data content ->", data.content);
            }
        }
        ServerBaseAPI.write(data)
    }    
}

const serverAPI = new ServerAPI()

export default serverAPI