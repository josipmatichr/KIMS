import React, {Component} from 'react'
import {SpinnerProcessing} from './spinner.component.jsx'

class TableRow extends Component {
    constructor(props) {
        super(props)        

        this.state = {
            secret: '' 
        }

        this._handleCellChange = this._handleCellChange.bind(this)
        this._handleKeyPress = this._handleKeyPress.bind(this)      
        this._handleBlur = this._handleBlur.bind(this)        
        this._handleButtonClick = this._handleButtonClick.bind(this)        
    }

    _handleCellChange(event) {
        this.setState({
            secret: event.target.value
        })
    }

    _handleKeyPress(event) {
        if(event.key === 'Enter') {
            this.enter = true
            this._handleBlur()
            event.target.blur()
            event.preventDefault()
            return            
        }        
        // Ignore space key
        if (event.which === 32) {
            event.preventDefault()
        }
    }

    _handleBlur() {
        if (this.enter) {
            this.enter = false
            return
        }
        const secret = (this.state.secret.trim() !== '') ? this.state.secret : null
        const { onGenerateKey, clientID } = this.props
        onGenerateKey({
            clientID: clientID,
            secret: secret})
    }

    _handleButtonClick() {  
        const { onButtonClick, clientID } = this.props
        if (onButtonClick)
            onButtonClick(clientID)        
    }

    _showKeySpinner(clientID, action) {
        if (action && action.clientID === clientID) {
            switch(action.type) {
                case Constants.GENERATE_KEY:
                    return true

                case Constants.GENERATE_KEY_DONE:
                    return false
            }
        }
        return false
    }

    render() {
        const { 
            nickname, 
            clientID, 
            showKeySpinner, 
            placeholder,
            buttonStyle, 
            buttonText } = this.props

        return (
            <tr>
                <td>{nickname}</td>                
                <td style={{position: 'relative', minWidth: '1%'}}>
                    <span>         
                        <input 
                            id={clientID} 
                            type='password' 
                            className='field secret' 
                            placeholder={placeholder} 
                            onChange={this._handleCellChange} 
                            onKeyPress={this._handleKeyPress}
                            onBlur={this._handleBlur}/>
                            <SpinnerProcessing 
                                location='after'                                        
                                show={showKeySpinner}/>                        
                    </span>                   
                </td> 
                <td>
                    <div 
                        className={'button ' + buttonStyle} 
                        onClick={this._handleButtonClick}>
                        {buttonText}
                    </div>
                </td>                
            </tr>                    
        )
    }
}

export default TableRow