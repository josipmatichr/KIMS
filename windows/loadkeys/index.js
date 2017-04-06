import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import path from 'path'
import * as child from 'child_process'
import fs from 'fs'
import LoadForm from './react/components/load.component.jsx'
import styles from './scss/main.scss'

const Keystore = {
    PATH: path.join(fs.realpathSync('.'), 'keystore/asymmetric'),
    PRIVATE: 'private_key.pem',
    PUBLIC: 'public_key.pem'
}

class ChildProcess {
    static loadPrivateKey(password) {
        const PATH = path.join(Keystore.PATH, Keystore.PRIVATE)
        const OPENSSL_DECRYPT_PRIVATE = 
            `openssl pkey -inform PEM -in ${PATH} -passin pass:${password}`
        return new Promise((resolve, reject) => {       
            child.exec(OPENSSL_DECRYPT_PRIVATE, (err, stdout) => {
                if (err) reject(err)
                password = ''
                resolve(stdout)
            })
        })
    }

    static loadPublicKey() {        
        const PATH = path.join(Keystore.PATH, Keystore.PUBLIC)        
        return new Promise((resolve, reject) => {
            fs.readFile(PATH, function(err, stdout) {
                if (err) reject(err) 
                resolve(stdout)
            });                
        })      
    }
}

class LoadKeys extends Component {
    constructor() {
        super()        
        this.handleLoadKeys = this.handleLoadKeys.bind(this)
    }

    handleLoadKeys(password) {   
        ipcRenderer.send('load-asymm-keys')    
        Promise.all([
            ChildProcess.loadPrivateKey(password),
            ChildProcess.loadPublicKey()])
            .then(keys => {
                ipcRenderer.send('asymm-keys-loaded', keys) // Pr=keys[0], Pu=keys[1]
            }).catch(err => {                
                ipcRenderer.send('asymm-keys-loaded', null)
                alert(`Error while loading keys:\n${err}`)
            })
    }

    render() {
        return (
            <LoadForm
                title={'Load asymmetric keys'}
                placeholder={'Enter your password'}
                buttonText={'Load keys'}
                onLoadKeys={this.handleLoadKeys}
                ipcCloseMsg={'toggle-load-keys-window'}/>
        )
    }
}

ReactDOM.render(<LoadKeys/>, document.getElementById('main'))