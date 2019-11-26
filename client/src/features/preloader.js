import React, { Component } from 'react'
import style from '../App.scss'
export default class Preloader extends Component {
    render() {
        return (
            <div className="overLoader">
             <div className="loader"></div>
           </div>
        )
    }
}
