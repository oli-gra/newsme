import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
   container: {
      display: 'flex',
      flexWrap: 'wrap',
   },
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
   },
   dense: {
      marginTop: theme.spacing(2),
   },
   menu: {
      width: 200,
   },
   button: {
      margin: theme.spacing(1),
   },
   input: {
      display: 'none',
   },
}))

const Login = ({ handleLogin }) => {

   const classes = useStyles()

   const [email, setEmail] = React.useState('')

   const handleChange = e => {
      setEmail(e.target.value)
      if (e.keyCode === 13 && email) {
         handleLogin(email)
      }
   }

   const handleSubmit = e => {
      e.preventDefault()
      if (email) { handleLogin(email) }
   }

   return (
      <div className='login'>
         <form className={classes.container} noValidate autoComplete="off">
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
         </form>
      </div>
   )
}

export default Login;