import Crypto from 'crypto'

const PARAMS = {
    usernameLength: 6
}

class Utils {
    static _hex2alphabet(inputHex) {
        const usernameLength = PARAMS.usernameLength || 5
        let hex = inputHex.toString(),
            str = '',
            dec = 0
        for (let i = 0; i < hex.length; i += 2) {
            dec = parseInt(hex.substr(i, 2), 16) % 25
            if (dec >= 10 && dec <= 25) {
                dec += 55
                str += String.fromCharCode(dec)
                if ( str.length >= usernameLength ) break
            }
        }
        return str        
    }

    static hash(input) {
        return Crypto.createHash('sha1').update(input).digest('hex');    
    }
    
    static getRandomName() {
        const time = new Date().getTime().toString();
        return this._hex2alphabet(Utils.hash(time))
    }

    static getTimestamp() {
        const date = new Date()
        return Date.UTC(
            date.getFullYear(), 
            date.getMonth(), 
            date.getDay(), 
            date.getHours(), 
            date.getMinutes() + new Date().getTimezoneOffset(), 
            date.getSeconds(), 
            date.getMilliseconds())
    }
}

module.exports = Utils