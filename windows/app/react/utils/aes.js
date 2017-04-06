var  crypto = require('crypto');

let algorithm = 'AES-128-ECB';



function encrypt(text, secret) {
    var chiper = crypto.createCipher(algorithm, secret);
    var crypted = chiper.update(text, 'utf-8', 'hex');
    crypted += chiper.final('hex');
    return crypted;
}

function decrypt(text, secret) {
    var decipher = crypto.createDecipher(algorithm, secret)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    encrypt : encrypt,
    decrypt : decrypt
}