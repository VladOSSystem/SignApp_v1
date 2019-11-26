import React, { Component } from "react";
import { saveAs } from 'file-saver';
import uuid from 'uuidv4';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Konva from "konva";
import { render } from "react-dom";
import { Stage, Layer, Line, Text } from "react-konva";
import PropTypes from 'prop-types';
import { MDBContainer,
         MDBRow, 
         MDBBtn,
         MDBCard, 
         MDBCardImage, 
         MDBCardBody, 
         MDBCardTitle,  
         MDBCardText,
         MDBAlert,
         MDBCol } from 'mdbreact';
import {connect} from 'react-redux';
import style from '../App.scss'; 
import {fetchPosts} from '../actions/propsActions'; 
import EndDoc from './EndDoc';
import Select from 'react-select';
// import 'bootstrap/dist/css/bootstrap.min.css';
 
const options = [
 { value: 'chocolate', label: 'Chocolate' },
 { value: 'strawberry', label: 'Strawberry' },
 { value: 'vanilla', label: 'Vanilla' },
];
class DrawSign extends Component {
  constructor(props){
    super(props) 
    this.state = {
      lines: [],
      innerW: window.innerWidth - 100,
      props: {
        name: '',
        surname: '',
        email: '',
        random: 0,
        download: false,
        base64:'',
        tagsValues: []
      },
      buttonPosition: {
        buttonName: '',
        toggle: false,
      },
      options: '',
      signValue: {
        signPlace:''
      },
      disableBtn: false
      
    };
  }
  
  componentWillMount(){
    window.addEventListener('resize', this.windowWidth);
  }
 
  handleMouseDown = () => {
    this._drawing = true;
    // add line
    this.setState({
      lines: [...this.state.lines, []]
    });
  };

  handleMouseMove = e => {
    // no drawing - skipping
    if (!this._drawing) {
      return;
    }
    const stage = this.stageRef.getStage();
    const point = stage.getPointerPosition();
    const { lines } = this.state;

    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    this.setState({
      lines: lines.concat()
    });
  };

  handleMouseUp = () => {
    this._drawing = false;
  };

  deleteSign = () => {
    this.setState({
      lines: []
    })
  }
 
 
  windowWidth = () => {
     const innerW = window.innerWidth;
     this.setState({
       innerW: innerW
     })
    }
   
    setBase = () => {
      let {name, surname, email, random, download, tagsValues, userInputsValue} = this.props.createPost
     
      let dataURL = this.stageRef.toDataURL();
      this.setState({
      props: {
        name: name,
        surname: surname,
        email: email,
        random: random,
        download: download,
        base64: dataURL,
        tagsValues: tagsValues
      },
      signValue: userInputsValue,
    })
  }
  createPDF = async () => {
    await axios.post('/create-img', this.state.props)
    .then(() => axios.post('/create-pdf', this.state))
  }
  fetchPDF = async () => {
   await axios.get('/fetch-pdf', {responseType: 'blob'})
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dokument.pdf'); 
      document.body.appendChild(link);
      link.click();
    }).then(() => axios.get('/hashPDF')) 
  }
  downloadPDF  = () => {
    this.setBase()
    this.setState({
      props:{
        name: this.state.props.name,
        surname: this.state.props.surname,
        email: this.state.props.email,
        random: this.state.props.random,
        download: this.state.props.download,
        base64: this.state.props.base64,
        tagsValues: this.state.props.tagsValues
      }
    })
    if(this.state.props.download === !false){
     
      Promise.resolve(this.createPDF()).then(setTimeout(() => {
        this.fetchPDF()
      },1500))
    } else {
      console.log('state console')
    } 
  }
  
 
  componentDidMount() {
    this.setBase(); 
  }
  buttonTbl = () => {
    
    this.setState({
        buttonPosition: {         
          buttonMain: {
            toggle: !this.state.buttonPosition.buttonMain.toggle,
            text: this.state.buttonPosition.buttonMain.text},
          buttonText: {
            toggle: false,
            text: this.state.buttonPosition.buttonText.text},
            buttonUnder: {
            toggle: false,
            text: this.state.buttonPosition.buttonUnder.text}
          }
        })
  }
  buttonGenerator = (v) => {
    this.setState({
      buttonPosition:{
        buttonName: v,
        toggle: !this.state.buttonPosition.toggle,
      }
    })
  }
  componentWillUnmount() {
    this.buttonGenerator()
  }
  handleButtonSelector = (event) => {
  let {userInputsValue, tagsValues} = this.props.createPost
      let findSign = tagsValues.find(element => element === `${userInputsValue.signPlace}`);
    
      if(findSign !== undefined){
        this.setState({options: `SIGN-${userInputsValue.signPlace}`});
      }else {
        this.setState({options:''});
      }
  }
  componentWillMount() {
    this.handleButtonSelector()
  }
  userPage =  () => {
    let { tagsValues, signValue} = this.state.props;
    // console.log(objectValue.length) 
    if(tagsValues !== undefined && signValue !== undefined){
      return true
    } else {
      return false
    }
   }
   getterSign = () => {
     if(this.userPage() !== true) {
       let signPlace = this.state.signValue.signPlace
       return signPlace
     } else {
       return ''
     }
   }
   conditionalSign = () => {
    if(this.userPage() !== true) {
      let sign = this.getterSign();
      let filterInput = this.state.props.tagsValues.find( input => input === `${sign}` );
      return filterInput
    } else {
      return false
    }
   }
   mainFilter = () => {
     if(this.conditionalSign() !== undefined){
       return true
     } else {
       return false
     }
   }
   signUpChecker = () => {
     if(Array.isArray(this.state.lines) && (this.state.lines).length){
       return true
     } else {
       return false
     }
   } 
 
  render() {
     let { tagsValues } = this.state.props;
     const { selectedOption } = this.state;
     let page = this.userPage(); 
     let sign = this.getterSign();
     let signUp = this.signUpChecker();
     let filter = this.conditionalSign();
     if(filter === undefined){
       filter = 'Twój podpis będzie wklejony na następnej stronie'
     }
     let filterCondition = this.mainFilter();
     console.log(this.state.options)
     return (
      <div>
      {
        page ? (
           <EndDoc/>
           ):(
             <MDBContainer>
             <MDBRow className="d-flex justify-content-center">
             <Stage
               style={{touchAction: 'none'}}
               onClick={this.setBase}
               onTap={this.setBase}
               className="block-example border border-primary mt-3 mb-3"
               width={this.state.innerW - 100}
               height={400}
               onContentMousedown={this.handleMouseDown}
               onContentMousemove={this.handleMouseMove}
               onContentMouseup={this.handleMouseUp}
               onContentTouchstart={this.handleMouseDown}
               onContentTouchmove={this.handleMouseMove}
               onContentTouchend={this.handleMouseUp}
               ref={node => {
                 this.stageRef = node;
               }}
             >
               <Layer>
                 {this.state.lines.map((line, i) => (
                   <Line key={i} points={line} stroke="black" onClick={this.setBase} onTap={this.setBase}/>
                 ))}
               </Layer>
             </Stage>
          
                 <MDBBtn
                 type="button"
                 gradient="purple"
                 rounded
                 className="btn-block z-depth-1a w-20"
                 onClick={this.deleteSign} 
             >
                 Ponownie podpisanie
             </MDBBtn>
             {filterCondition ? (
              <React.Fragment>
              <h2>Wybierz miejsce gdzie chcesz się podpisać</h2>
              <MDBCard style={{ width: '98.5%' }}>
              <MDBCardBody>
              <select 
                value={this.state.options} 
                onChange={this.handleButtonSelector}
                className="form-control" id="exampleFormControlSelect1"
              >
                <option defaultValue value={'SIGN-'+ this.state.signValue.signPlace}>{'SIGN-'+ this.state.signValue.signPlace}</option>
            </select>
              </MDBCardBody>
              </MDBCard> 
              </React.Fragment>
             ):(
              <MDBCard style={{ width: '98.5%' }}>
              <MDBCardBody>
                <div className="d-flex justify-content-center align-items-center">
                  {filter}
                </div>
              </MDBCardBody>
              </MDBCard>
              )}
             
           {signUp ? (
          <div className="container">
            <div className="row">
              <Link to={{pathname:'/done'}} className="btnSign">
              <MDBBtn
              type="button"
                gradient="blue"
                rounded
                className="btn-block z-depth-1a w-20 mt-3"
                onClick={this.downloadPDF}
                >
                Podpisz dokument 
                </MDBBtn>
                </Link>
              </div>
            </div>
           ):(
      <div className="container">
        <div className="row">
        <MDBCol  sm="12" md="12" lg="12">
          <MDBAlert color="danger mt-3 mb-3 d-flex justify-content-center align-items-center" >
            Proszę podpisać się wyżej!
          </MDBAlert>
          </MDBCol>
            <MDBBtn
            type="button"
            gradient="blue"
            rounded
            disabled
            className="btn-block z-depth-1a w-20 mt-3"
            onClick={this.downloadPDF}
            >
            Podpisz dokument 
            </MDBBtn>
        </div>
      </div>
        )}
             </MDBRow>
             </MDBContainer>
           )
      }
        
      </div>
    );
  } 
}

DrawSign.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  createPost: PropTypes.object
};

const mapStateToProps = state => ({
  posts: state.posts.items,
  createPost: state.posts.item
});


export default connect(mapStateToProps, {fetchPosts})(DrawSign);