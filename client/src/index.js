import React, {lazy, Suspense, Component} from 'react';
import ReactDOM from 'react-dom';
import Preloader from './features/preloader'
// import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
const App = lazy(() => import('./App'))
    ReactDOM.render(
    <Router>
        <Suspense fallback={<Preloader/>}>
             <App />
        </Suspense>
     </Router>,
     document.getElementById('root'));

