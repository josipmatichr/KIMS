import Crypto from 'crypto'

const DEFAULTS = {
    pbkdf2: {
        iterations: 300000,
        output: 16,
        hash: 'sha256'
    }
}

class SecurityAPI {

    static generateKey(secret, salt, options) {
        let { iterations, output, hash } = options || DEFAULTS.pbkdf2          
        iterations = +iterations
        output = +output
        iterations = iterations > 0 ? iterations : DEFAULTS.pbkdf2.iterations
        output = output > 0 ? output : DEFAULTS.pbkdf2.output
        hash = Crypto.getHashes().includes(hash) ? hash  : DEFAULTS.pbkdf2.hash 

        return new Promise((resolve, reject) => {
            Crypto.pbkdf2(
                secret, 
                salt , 
                iterations,
                output,
                hash, 
                (err, key) => {
                    (err) ? ( 
                        reject(Error(`Problem generating a key from (${secret}, ${salt}); error: ${err}`))
                    ) : (
                        resolve(key)                        
                    )}
            );
        })
    }
}

export default SecurityAPI