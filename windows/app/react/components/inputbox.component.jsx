import React, {Component} from 'react'

class InputBox extends Component {
    constructor(props) {
        super(props)        

        this.state = {
            message: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)        
        this.handleButtonClick = this.handleButtonClick.bind(this)        
    }

    handleChange(event) {
        this.setState({
            message: event.target.value
        })
    }

    handleKeyPress(event) {
        if(event.key == 'Enter') {
            this.handleButtonClick()
            event.preventDefault()
        }        
    }

    handleButtonClick() {  
        const { message } = this.state
        if (message) {
            this.props.onSendMsg(message)
            this.setState({
                message: ''
            })
        }              
    }

    render() {
        const { msgText, buttonText } = this.props
        const { message } = this.state
        return (
            <div className="cns-container input-box">                                        
                <input 
                    className="cns-cell -w-10-12 -flex field" 
                    placeholder={msgText} 
                    value={message} 
                    onChange={this.handleChange} 
                    onKeyPress={this.handleKeyPress}/>
                <div 
                    className="cns-cell -w-2-12 button" 
                    onClick={this.handleButtonClick}>
                    {buttonText}
                </div>
            </div>            
        )
    }
}

export default InputBox