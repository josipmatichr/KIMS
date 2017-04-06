import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import IntroPage from './react/containers/intropage.container.js'
import MainPage from './react/containers/mainpage.container.js'
import AppStore from './react/stores/app.store.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styles from './scss/main.scss'

class App extends Component {
    constructor() {
        super()

        this.state = {
            connected: false,
            connecting: false
        }
        this._onAppStoreChange = this._onAppStoreChange.bind(this)
    }

    _onAppStoreChange() {
        const state = AppStore.getState()         
        this.setState(state)
    }

    componentWillMount() {
        AppStore.addChangeListener(this._onAppStoreChange);        
    }

    componentDidUpdate() {
        const { error } = this.state
        if (error) alert(error)
    }

    componentWillUnmount() {
        AppStore.removeChangeListener(this._onAppStoreChange);                 
    }    

    render() {
        const { connected, connecting, nickname } = this.state

        return (
            <div>
                <ReactCSSTransitionGroup 
                    transitionName='app'
                    transitionAppear={true}
                    transitionAppearTimeout={100}
                    transitionEnter={true}
                    transitionLeave={false}
                    transitionEnterTimeout={500}>            
                    { connected ? (
                        <MainPage
                            nickname={nickname}/>
                    ) : (                    
                        <IntroPage 
                            title={'Welcome to Crypto@FESB'}
                            connecting={connecting}/>
                    )}  
                </ReactCSSTransitionGroup>     
            </div>  
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('main'))