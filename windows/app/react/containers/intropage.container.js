import React, {Component} from 'react'
import ServerForm from '../components/serverform.component.jsx'
import {DEFAULT_SERVER} from '../utils/serverBaseAPI.js'
import UIActionCreator from '../actions/ui.actioncreator.js'

class IntroPage extends Component {
    constructor(props) {
        super(props)

        this.handleServerConnect = this.handleServerConnect.bind(this)
    }

    handleServerConnect(options) {
        UIActionCreator.serverConnect(options)
    }

    render() {
        const { title, connecting } = this.props
        return (
            <div className="intro-page cns-page -space">
                <div className="cns-container -column -h-7-12 -justify-around -align-center">
                    <div className="cns-cell -w-12-12">
                        <div className="logo"/>
                    </div>
                    <ServerForm 
                        spinner={connecting}
                        serverText={'Server address'}
                        portText={'Port'}
                        nickText={'Nickname'}
                        buttonText={'Join'}
                        onServerConnect={this.handleServerConnect}
                        defaultServer={DEFAULT_SERVER}/>       
                </div>
            </div>            
        )
    }
}

export default IntroPage