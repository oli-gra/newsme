import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
   container: {
      display: 'flex',
      flexWrap: 'wrap',
   },
   textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
      width: '60%',
   },
   dense: {
      margin: theme.spacing(3),
   },
   button: {
      margin: theme.spacing(3),
      position: 'absolute',
      right: theme.spacing(1),
      bottom: theme.spacing(0),
      width: '20%',
   },
   input: {
      display: 'none',
   },
}))

const Login = ({ handleLogin }) => {

   const classes = useStyles()

   const [valid, setValid] = React.useState(false);
   const [email, setEmail] = React.useState('')

   const handleChange = e => {
      setEmail(e.target.value)
      if (e.keyCode === 13 && email) {
         setValid(true)
         handleLogin(email)
      }
   }

   const handleSubmit = e => {
      e.preventDefault()
      if (email) {
         setValid(true)
         handleLogin(email)
      }
   }

   let message
   let action
   if (!valid) {
      message = <DialogContentText id="alert-dialog-description" className={classes.dense}>
         enter your email and we'll send you a link right away
          </DialogContentText>
      action = <>
         <TextField
            id="outlined-name"
            label='email'
            className={classes.textField}
            type='email'
            value={email}
            onChange={handleChange}
            onKeyDown={handleChange}
            margin="normal"
            variant="outlined"
         />
         <Button
            variant="contained"
            color="secondary"
            size='large'
            className={classes.button}
            type="submit"
            onClick={handleSubmit}>
            login
             </Button>
      </>
   }
   if (valid) {
      message = <DialogContentText id="alert-dialog-description" className={classes.dense}>
         email on its way, follow the link to get news
      </DialogContentText>
   }

   return (
      <>
         <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">newsme</DialogTitle>
            {message}

            {action}


         </Dialog>
      </>
   )
}

export default Login;