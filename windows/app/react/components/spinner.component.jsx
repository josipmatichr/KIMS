import React from 'react'

const Spinner = (props) => {
    return ( 
        <div className={'overlay ' + (props.show ? 'visible' : '')}>       
            <div className='spinner -circle-1'></div>
            <div className='margin -tb-2 text-center text-size -s-2'>{props.text}</div>
        </div>            
    )
}

const SpinnerProcessing = (props) => {
    return (
        <div className={props.show ? ('visible ' + props.location) : 'hidden'}>
            <div className="spinner -circle-2"></div>
        </div>             
    )
}

export {Spinner as default, SpinnerProcessing} 