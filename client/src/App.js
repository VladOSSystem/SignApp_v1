import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Form from './components/Form';
import DrawSign from './components/DrawSign';
import {Provider} from 'react-redux';
import store from './store';
import EndDoc from './components/EndDoc'
import Thanks from './components/Thanks'
export default class App extends Component {
  render() {
   return (
     <Provider store={store}>
      <Router >
        <Switch>
          <Route  path="/signDocument/:hash" component={Form}>
              <Form/>
          </Route>
          <Route path="/dokument" component={DrawSign}>
              <DrawSign/>
          </Route>
          <Route path="/done" component={Thanks}>
          <Thanks/>
          </Route>
          <Route path="/" component={EndDoc}>
          <EndDoc/>
          </Route>
          <Route render={() => <Redirect to="/" />} />
        </Switch>
        </Router>
        </Provider>
        )
      } 
    }
    
    // <Redirect
    // to={{
    //   pathname: "/"
    // }}/>