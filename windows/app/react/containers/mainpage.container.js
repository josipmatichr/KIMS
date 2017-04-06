import React, {Component} from 'react'
import UIActionCreator from '../actions/ui.actioncreator.js'
import MsgBoard from '../components/msgboard.component.jsx'
import ClientsBoard from '../components/clientsboard.component.jsx'
import ClientsStore from '../stores/clients.store.js'
import MsgStore from '../stores/msg.store.js'
import Utils from '../utils/utils.js'
import {ipcRenderer as ipc} from 'electron'


const Hamburger = (props) => {
    const { toggleClientsBoard } = props
    return (
        <div className="cns-container -align-center hamburger" 
            onClick={toggleClientsBoard}>
            <div className="icon">
                <span/>
            </div>
            <div className="label">
                <span>Clients board</span>
            </div>
        </div>  
    )  
}

const Welcome = (props) => {
    const { nickname, clients, toggleClientsBoard } = props.props
    return (
        <div className="cns-container -align-center">
            <div className="chat"/>
            <div>Hello <span className="nickname">{nickname}</span></div>
            <div className="active" 
                onClick={toggleClientsBoard}> 
                users online: {Object.keys(clients).length + 1}
            </div>                
        </div>  
    )    
}

const Header = (props) => {
    const { toggleClientsBoard } = props
    return (        
        <header className="cns-container -justify-between -align-center header">
            <Hamburger toggleClientsBoard={toggleClientsBoard}/>
            <Welcome props={props}/>    
        </header>            
    )
}

class MainPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            nickname: null,
            clientID: null,
            secret: null,
            key: null,
            keysAsymm: {},
            clients: {},
            clientsBoard: false}

        this._onClientsStoreChange = this._onClientsStoreChange.bind(this)            
        this._onMsgStoreChange = this._onMsgStoreChange.bind(this)
        this._handleSendMsg = this._handleSendMsg.bind(this)
        this._handleGenerateKey = this._handleGenerateKey.bind(this)
        this._handleLoadKeys = this._handleLoadKeys.bind(this)
        this._handleSendRequest = this._handleSendRequest.bind(this)
        this._toggleClientsBoard = this._toggleClientsBoard.bind(this)
    }

    _onClientsStoreChange() {
        const state = ClientsStore.getState()
        this.setState(state)  
        console.log('MainPage.ClientsStore state ->', this.state)            
    }

    _onMsgStoreChange() {
        const state = MsgStore.getState()
        this.setState(state)  
        console.log('MainPage.MsgStore state ->', this.state)           
    }        

    _handleSendMsg(msg) {
        const { nickname, clientID } = this.state
        const _msg = {
            clientID: clientID,
            nickname: nickname,            
            timestamp: Utils.getTimestamp(),
            content: msg}        
        UIActionCreator.sendMsg(_msg)
    }

    _handleGenerateKey(params) {
        const { secret, clientID, clients } = this.state
        if (params.secret) {
            if (params.clientID === clientID) {
                if (params.secret === secret) return
            } else {
                if (params.secret === clients[params.clientID].secret) return
            }
            UIActionCreator.generateKey(params)
            return
        }
        UIActionCreator.deleteKey(params)
    }

    _handleLoadKeys(clientID) {        
        UIActionCreator.loadAsymmKeys()
    }

    _handleSendRequest(clientID) {
        console.log('Send Request To ->', clientID) // TBD
    }    

    _toggleClientsBoard() {
        const { clientsBoard } = this.state 
        this.setState({
            clientsBoard: !clientsBoard})    
    }

    componentWillMount() {
        ClientsStore.addChangeListener(this._onClientsStoreChange)         
        MsgStore.addChangeListener(this._onMsgStoreChange)      
    }

    componentWillUnmount() {
        ClientsStore.removeChangeListener(this._onClientsStoreChange)        
        MsgStore.removeChangeListener(this._onMsgStoreChange)                         
    }

    render() {
        const { title } = this.props
        const { messages, clientID, key, publicKey, clients } = this.state        
        const { nickname } = this.props
        return (
            <div className="main-page">
                <div className="cns-page -space">
                    <div className="cns-container">                    
                        <Header 
                            title={title}
                            nickname={nickname}
                            clients={clients}
                            toggleClientsBoard={this._toggleClientsBoard}/>
                        
                        <MsgBoard
                            clientID={clientID}
                            messages={messages}
                            handleSendMsg={this._handleSendMsg}/>            
                    </div>                            
                </div>    
                <div className="cns-page -absolute">                   
                    <ClientsBoard                     
                        show={this.state.clientsBoard}
                        clientID={clientID}
                        nickname={nickname}
                        localClientKey={key}
                        publicKey={publicKey}
                        clients={[clients]}               
                        onGenerateKey={this._handleGenerateKey}
                        onLoadKeys={this._handleLoadKeys}
                        onSendRequest={this._handleSendRequest}
                        onToggle={this._toggleClientsBoard}/>            
                </div>
            </div>                    
        )
    }
}

export default MainPage