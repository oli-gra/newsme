import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import * as firebase from 'firebase/app'


// style theme
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import dark from './style/dark'

firebase.auth().onAuthStateChanged(() =>
   ReactDOM.render(
      <MuiThemeProvider theme={dark}>
         <CssBaseline />
         <App />
      </MuiThemeProvider>
      , document.getElementById('root'))
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
