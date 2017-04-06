import React, {Component} from 'react'
import {Constants} from '../dispatcher/app.dispatcher.js'
import TableRow from './tablerow.component.jsx'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class ClientsBoard extends Component {
    constructor(props) {
        super(props)
        this.titles = {
            secretCellPlaceholder: 'Enter a secret',
            tableHeaderCol1: 'User',
            tableHeaderCol2: 'Secret',
            tableHeaderCol3: 'Key agreement',
            loadKeysBtnText: 'Load asym keys',
            loadKeysBtnTextActive: 'Loading...',
            loadKeysBtnTextDone: 'Asym keys \u2713', // \u2713 - checkmark
            keyAgreeBtnText: 'Send request'
        }

        this._closeMe = this._closeMe.bind(this)
    }

    _closeMe() {
        this.props.onToggle()
    }

    render() {
        const clients = this.props.clients[0]
        const { 
            show, 
            clientID, 
            nickname, 
            localClientKey,
            publicKey, 
            onGenerateKey, 
            onLoadKeys, 
            onSendRequest } = this.props

        const showKeySpinner = (clientID, key) => {
            if (clientID && key === Constants.GENERATE_KEY) return true
            return false
        }

        const { loadKeysBtnText, loadKeysBtnTextActive, loadKeysBtnTextDone } = this.titles
        const button = () => {
            if (publicKey) {
                switch(publicKey) {
                    case Constants.LOAD_ASYM_KEYS:
                        return {
                            text: loadKeysBtnTextActive,
                            style: ''
                        }

                    default: {
                        return {
                            text: loadKeysBtnTextDone,
                            style: '-loaded'
                        }
                    }     
                }
            }
            return {
                text: loadKeysBtnText,
                style: ''
            }
        }

        const formattedClients = Object.keys(clients).map((client, index) => {   
            return ( 
                <TableRow 
                    key={index}
                    clientID={client}
                    nickname={clients[client].nickname}       
                    showKeySpinner={showKeySpinner(client, clients[client].key)}             
                    placeholder={this.titles.secretCellPlaceholder}                    
                    buttonText={this.titles.keyAgreeBtnText}
                    onGenerateKey={onGenerateKey}
                    onButtonClick={onSendRequest}/>               
            )
        })      

        return (
            <div className={'cns-container clients-board ' + (show ? 'visible' : '')}>            
                <a href="#" className='close-btn' onClick={this._closeMe}>&times;</a>
                <table className="clients-table">                
                        <thead className="th">
                            <tr>
                                <th>{this.titles.tableHeaderCol1}</th>
                                <th>{this.titles.tableHeaderCol2}</th>
                                <th>{this.titles.tableHeaderCol3}</th>                        
                            </tr>
                        </thead>
                        <ReactCSSTransitionGroup 
                            component='tbody'
                            transitionName='app'
                            transitionAppear={true}
                            transitionAppearTimeout={100}
                            transitionEnter={true}
                            transitionLeave={true}
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}> 
                            {/* This row represent the local client. */}                       
                            <TableRow 
                                key={clientID}
                                clientID={clientID}
                                nickname={nickname}
                                showKeySpinner={showKeySpinner(clientID, localClientKey)}                                
                                placeholder={this.titles.secretCellPlaceholder}
                                buttonStyle={button().style}
                                buttonText={button().text}
                                onGenerateKey={onGenerateKey}
                                onButtonClick={onLoadKeys}/>
                            {/* These rows represent other 'online' clients. */}                                
                            {formattedClients}                    
                        </ReactCSSTransitionGroup>
                </table>               
            </div> 
        )
    }
}

export default ClientsBoard