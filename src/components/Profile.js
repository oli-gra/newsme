import React, { useState, useEffect } from 'react'
import axios from 'axios'
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

const Profile = ({ fuser, signOut, postUser }) => {

   const classes = useStyles()

   const url = 'http://localhost:3003' // Node server

   const [displayName, setName] = useState('')
   const [email, setEmail] = useState('')
   const [location, setLoc] = useState('')
   const [photoUrl, setPic] = useState('')

   useEffect(() => { if (email === '') { getUser() } })

   const getUser = () => {
      axios.get(url + '/user?uid=' + fuser.uid)
         .then(res => {
            setName(res.data.displayName)
            setEmail(res.data.email)
            setLoc(res.data.location)
            setPic(res.data.photoUrl)
         })
   }

   const saveInput = e => {
      e.preventDefault()
      let user = {
         uid: fuser.uid,
         displayName: displayName,
         email: email,
         location: location,
         photoUrl: photoUrl,
      }
      console.log(user)
      postUser(user)
   }

   return (
      <div className='profile' >
         <form onSubmit={saveInput}>
            <div>{photoUrl}</div>
            <TextField
               id="outlined-name"
               label='name'
               className={classes.textField}
               value={displayName}
               onChange={event => setName(event.target.value)}
               margin="normal"
               variant="outlined"
            />
            <TextField
               disabled
               id="outlined-disabled"
               label={email}
               // defaultValue={email}
               className={classes.textField}
               margin="normal"
               variant="outlined"
            />
            <TextField
               id="outlined-name"
               label='location'
               className={classes.textField}
               value={location}
               onChange={event => setLoc(event.target.value)}
               margin="normal"
               variant="outlined"
            />
            <Button
               variant="outlined"
               size="medium"
               className={classes.button}
               type="submit">
               Save
         </Button>
            <Button
               variant="outlined"
               size="medium"
               className={classes.button}
               onClick={() => signOut}
            >
               Sign out
         </Button>

         </form>
      </div>
   );
}

export default Profile;