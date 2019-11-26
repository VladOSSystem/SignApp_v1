import React, { Component } from 'react';
import { saveAs } from 'file-saver'
import axios from 'axios';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { Link, Redirect, BrowserRouter as Router, Route } from 'react-router-dom';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import EndDoc from './EndDoc'
import {createPost} from '../actions/propsActions'
import {  
     MDBContainer,
     MDBRow, MDBCol,
     MDBCard,
     MDBCardBody,
     MDBInput,
     MDBBtn,
     MDBFormInline,
     MDBModalFooter,
     MDBModal,
     MDBModalHeader,
     MDBModalBody
      } from 'mdbreact';
import '../App.scss';
import { Document, Page, pdfjs } from "react-pdf";
import file from '../PDF/main.pdf'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
class Form extends Component {
  constructor(){
    super();
    this.state = {
         random:  Math.floor(Math.random() * 1000000000),
         download: true,
         tagsValues: [],
         userInputsValue:{}, 
         numPages: null, 
         pageNumber: 1,
         innerW: 0,
         modal: false
       }
  }
  windowWidth = () => {
    let width = window.innerWidth,
        widths= 0
  switch(true){
    case (width >= 345 && width < 450):
      widths = 312;
      break;
    case (width >= 1 && width < 345):
      widths = 225;
      break;
    default:
      widths = window.innerWidth-100
}
  this.setState({
    innerW:widths   

  })
 }

  componentWillMount(){
    this.windowWidth()
    window.addEventListener('resize', this.windowWidth);
  }

    downloadPDF = () => {
      this.setState({
        download: !this.state.download
      })
     }
   
    handleForm = (evt) => {
      this.props.createPost(this.state)
      this.setState({userInputsValue:{[evt.target.name]: evt.target.value }});
      
    }
    onSubmit = () => {
 
      const props = {
        random: this.state.random,
        download: this.state.download,
        tagsValues: this.state.tagsValues,
        userInputsValue: this.state.userInputsValue
      }
      this.props.createPost(props)
    }
    uploadData = async () => {
      await axios.post('/parse-pdf')
      .then((response) => {})
    }
    fetchButtons = async () => {
     await axios.get('/fetch-buttons')
      .then((response) => {
         this.setState({
            tagsValues: response.data.text
         })
        })
          
    }
    userValue = async () => {
      let hash = window.location.pathname.slice(13)
      await axios.get(`${hash}`)
            .then((response) => {
              if(Object.entries(response) !== undefined && response.constructor === Object){
              this.setState({
                userInputsValue: response.data[0]
              })
            } else {
              console.log('none')
            }
            })
    }
    componentDidMount(){
      this.userValue()
      Promise.resolve(this.uploadData()).then(setTimeout(() => {
        this.fetchButtons()
        
      },500))
    }
   userPage =  () => {
    let objectValue = this.state.userInputsValue
    // console.log(objectValue.length) 
    if((objectValue) === undefined){
      return true
    } else {
      return false
    }
   }
   onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));

  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
  
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }
   
  render() {
    let random = this.state.random;
    let date = new Date(); 
    let day = date.getUTCDate(),
        mounth = date.getUTCMonth() + 1;
    let page = this.userPage()
    const { pageNumber, numPages } = this.state;
      console.log(this.state.innerW)
    return (
      <div>
      {page ? (
        <EndDoc/>
      ) : (
        <MDBContainer style={{marginTop: "50px"}}>
      <MDBRow className="d-flex alignt-items-center justify-content-center mt-4 mb-4">
        <MDBCol  sm="10" md="8" lg="6">
        <MDBCard >
            <MDBCardBody className="mx-4"sm="10" md="8" lg="6">
              <div className="text-center">
                <h3 className="dark-grey-text mb-1">
                  <strong>Dokument<h6>Data/{day}/{mounth}/{random}</h6 ></strong>
                </h3>
              </div>
            
              <MDBInput
              label="Imię"
              name="name"
              group
              type="text"
              validate
              error="wrong"
              success="right"
              value={this.state.userInputsValue.firstName}
              // value={this.state.name}
              onChange={this.handleForm}
              />
              <MDBInput
                label="Nazwisko"
                name="surname"
                group
                type="text"
                validate
                error="wrong"
                success="right"
                value={this.state.surname}
                onChange={this.handleForm}
                value={this.state.userInputsValue.lastName}
              />
              <MDBInput
                label="Wpisz swój email"
                name="email"
                group
                type="email"
                validate
                containerClass="mb-0"
                value={this.state.email}
                onChange={this.handleForm}
                value={this.state.userInputsValue.email}
              />
              
              <div className="text-center mb-3">
              <MDBBtn  
              type="button"
              gradient="purple"
              className="btn-block z-depth-1a"
              rounded onClick={this.toggle}
              >Modal</MDBBtn>
              <Link to={{pathname:'/dokument'}} >
             
                <MDBBtn 
                  type="button"
                  gradient="blue"
                  rounded
                  onClick={this.onSubmit}
                  className="btn-block z-depth-1a"
                >
                
                  Podpisz dokument
                </MDBBtn>
                </Link>
              </div>
            </MDBCardBody>
            <MDBModalFooter className="mx-5 pt-3 mb-1 d-flex justify-items-center justify-content-center flex-column">
            </MDBModalFooter>
            </MDBCard>

            <MDBModal isOpen={this.state.modal} toggle={this.toggle} size="fluid" role="document" className="modal-dialog">
              <MDBModalHeader toggle={this.toggle}>PDF preview</MDBModalHeader>
              <MDBModalBody>
              <div className="mb-3">
          
              Page {pageNumber} of {numPages}
              <div className="sticky">
                <MDBBtn outline color="primary" onClick={this.goToPrevPage}>Prev</MDBBtn>
                <MDBBtn outline color="primary" onClick={this.goToNextPage}>Next</MDBBtn>
              </div>
              <div className="mt-3">
              
              <Document
                renderMode="canvas"
                file={file}
                onLoadSuccess={this.onDocumentLoadSuccess}
                >
                <Page
                 pageNumber={pageNumber}   
                 width={this.state.innerW} 
              />
              </Document>
              </div>
            </div>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
              </MDBModalFooter>
            </MDBModal>

        </MDBCol>
      </MDBRow>
    </MDBContainer>
      )}
      </div>
    )
  } 
}
Form.propTypes = {
  createPost: propTypes.func.isRequired
}
export default connect(null,{ createPost })(Form)
