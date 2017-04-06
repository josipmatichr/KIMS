import React, {Component} from 'react'
import {ipcRenderer} from 'electron'

class LoadForm extends Component {
    constructor(props) {
        super(props)
        this.state = {value: ''}

        this.handleCloseClick = this.handleCloseClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)         
        this.handleLoadClick = this.handleLoadClick.bind(this)       
    }
    render() {
        const { title, placeholder, buttonText } = this.props
        const { value } = this.state
        return (
            <div className="cns-page cns-container -column -justify-around">
                <div 
                    className="close-btn"
                    onClick={this.handleCloseClick}>
                    &times;
                </div>  
                <div className="title">
                    {title}
                </div>                
                <div className="cns-container input-box">                     
                    <input
                        className="cns-cell -w-10-12 -flex field" 
                        type="password" 
                        value={value}
                        placeholder={placeholder} 
                        onChange={this.handleChange} 
                        onKeyPress={this.handleKeyPress}/>
                    <div 
                        className="cns-cell -w-2-12 button" 
                        onClick={this.handleLoadClick}>
                        {buttonText}
                    </div>
                </div>      
            </div>   
        )
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        })
    }

    handleCloseClick() {
        ipcRenderer.send(this.props.ipcCloseMsg)
    }

    handleLoadClick() {
        this.onLoadKeys()        
    }

    handleKeyPress(event) {
        if(event.key == 'Enter') {
            this.onLoadKeys()
            event.preventDefault()
        }        
    }

    onLoadKeys() {
        const value = this.state.value.trim()
        if (value) {
            this.props.onLoadKeys(value)
            this.setState({
                value: ''
            })            
        }
    }    
}

export default LoadForm