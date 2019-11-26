import React, { Component } from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import '../App.scss';
export default class EndDoc extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                 <div className="col-md-12">
                    <div className="width d-flex align-items-center justify-content-center ">
                    <div>
                    <p className="d-flex align-items-center justify-content-center ">
                    Proszę przejść za linkiem, który był wyświetlony przez system.      
                    </p>
                    <div>
                    <div className="cross-icon cross-delete animateDeleteIcon" style={{display: 'block'}}>
                      <span className="cross-x-mark animateXMark">
                        <span className="cross-delete-line cross-delete-left" />
                        <span className="cross-delete-line cross-delete-right" />
                      </span></div>
                  </div>
                 </div>
                 </div>
                 </div>
                 </div>
            </div>
        )
    }
}
