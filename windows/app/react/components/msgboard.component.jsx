import React, {Component} from 'react'
import InputBox from './inputbox.component.jsx'
import UIActionCreator from '../actions/ui.actioncreator.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const Msg = (props) => {
    const { outgoing, nickname, timestamp, content } = props
    const direction = outgoing ? 'out' : 'in'
    return (        
        <div className={'msg-cloud -' + direction}>
            <div className={'msg-cloud -' + direction + ' -content'}>
                <div className='cns-container -column'>
                    <span className='cns-cell msg-cloud -bold'>{nickname}</span>                 
                    <span className='cns-cell msg-cloud -main-text'>{content}</span>                   
                    <div className='cns-container -column -align-end'>
                        <div className='cns-cell -pad-l msg-cloud -small'>
                            <span>{timestamp}</span>                            
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    )
}

class MsgBox extends Component {
    constructor(props) {
        super(props)
    }

    componentDidUpdate() {
        this.end.scrollIntoView()
    }

    render() {  
        const { children } = this.props  
        return (
            <div className='msg-box field' ref>  
                {children}
                <div ref={(el) => this.end = el}/>  
            </div>
        )      
    }
}


class MsgBoard extends Component {
    constructor(props) {
        super(props)

        this._handleSendMsg = this._handleSendMsg.bind(this)
    }

    _handleSendMsg(msg) {
        this.props.handleSendMsg(msg)
    }

    _areEqual(first, second) {
        return first === second
    }

    render() {
        const { messages, clientID } = this.props
        const formattedMsgs = messages.map((msg, index) => { 
            const outgoing = this._areEqual(msg.clientID, clientID),
                  date = new Date(msg.timestamp),                        
                  timestamp = date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2)                           
            return ( 
                <Msg
                    key={index}
                    outgoing={outgoing}
                    nickname={msg.nickname}
                    timestamp={timestamp}
                    content={msg.content}/>
            )
        })

        return (
            <div className="msg-board">                
                <MsgBox>
                    <ReactCSSTransitionGroup 
                        transitionName='msg'
                        transitionAppear={true}
                        transitionAppearTimeout={100}
                        transitionEnter={true}
                        transitionLeave={false}
                        transitionEnterTimeout={1000}>                 
                        {formattedMsgs}  
                    </ReactCSSTransitionGroup>
                </MsgBox>
                <InputBox
                    msgText={'Type your message'}
                    buttonText={'Send'}
                    onSendMsg={this._handleSendMsg}/>
            </div>                      
        )
    }
}

export default MsgBoard