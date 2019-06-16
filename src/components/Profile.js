import React, { useState, useEffect } from 'react'
import axios from 'axios'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
   },
   dense: {
      marginTop: theme.spacing(2),
   },
   button: {
      margin: theme.spacing(1),
   }
}))

const Profile = ({ fuser, postUser }) => {

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
      postUser(user)
   }

   return (
      <div className='profilecontainer'>
         <div className='profile'>
            <ExpansionPanel defaultExpanded>
               <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1c-content"
                  id="panel1c-header">
                  <div className={classes.column}>
                     <Typography className={classes.heading}>Personal info</Typography>
                  </div>
               </ExpansionPanelSummary>
               <ExpansionPanelDetails className={classes.details}>
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
                        variant="contained"
                        color="secondary"
                        size='large'
                        className={classes.button}
                        type="submit">
                        Save
                  </Button>
                  </form>
               </ExpansionPanelDetails>
            </ExpansionPanel>
         </div>
      </div>
   )
}

export default Profile