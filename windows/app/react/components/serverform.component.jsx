import React, {Component} from 'react'
import Spinner from './spinner.component.jsx'

class ServerForm extends Component {
    constructor(props) {
        super(props)        

        this.state = {
            server: props.defaultServer.host,
            port: props.defaultServer.port,
            nickname: ''}

        this.handleServerChange = this.handleServerChange.bind(this)
        this.handlePortChange = this.handlePortChange.bind(this)
        this.handleNickChange = this.handleNickChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)        
        this.handleButtonClick = this.handleButtonClick.bind(this)        
    }

    handleServerChange(event) {
        this.setState({
            server: event.target.value
        })
    }

    handlePortChange(event) {
        this.setState({
            port: event.target.value
        })
    }

    handleNickChange(event) {
        this.setState({
            nickname: event.target.value
        })
    }

    handleKeyPress(event) {
        if(event.key == 'Enter') {
            this.handleButtonClick()
            event.preventDefault()
        }        
    }

    handleButtonClick() {
        this.props.onServerConnect(this.state)
    }

    render() {
        const { spinner, serverText, portText, nickText, buttonText } = this.props
        const spinnerText = `Connecting to ${this.state.server}:${this.state.port}...`
        return (
            <div className="cns-container server-form">
                <input 
                    className="cns-cell -w-8-12 field -no-right-border" 
                    placeholder={serverText} 
                    maxLength="30" 
                    tabIndex="0" 
                    onChange={this.handleServerChange} 
                    onKeyPress={this.handleKeyPress}/>
                <input 
                    className="cns-cell -w-4-12 field" 
                    type="number" 
                    placeholder={portText} 
                    onChange={this.handlePortChange} 
                    onKeyPress={this.handleKeyPress}/> 
                <input 
                    className="cns-cell -w-12-12 field" 
                    placeholder={nickText} maxLength="15" 
                    onChange={this.handleNickChange} 
                    onKeyPress={this.handleKeyPress}/>
                <div 
                    className="cns-cell -w-12-12 button" 
                    onClick={this.handleButtonClick}>
                    {buttonText}
                </div>                        
                <Spinner 
                    text={spinnerText}
                    show={spinner}/>                     
            </div>         
        )
    }
}

export default ServerForm