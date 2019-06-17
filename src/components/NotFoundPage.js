import React from 'react'
import Login from './Login'

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
   heading: {
      fontSize: theme.typography.pxToRem(15),
   }
}))

const NotFoundPage = ({ user, handleLogin }) => {

   const classes = useStyles()

   let message
   if (user && user.validEmail) {
      message = <Typography className={classes.heading}>
         Loading...</Typography>

   }

   if (user && !user.validEmail) {
      message = <Typography className={classes.heading}>
         Get the link from your email to validate</Typography>
   }

   if (!user) {
      message = <Login handleLogin={handleLogin} />
   }

   return (
      <>
         {message}
      </>
   )
}

export default NotFoundPage