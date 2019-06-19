import React, { useState, useEffect } from 'react'
import axios from 'axios'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AcountBoxIcon from '@material-ui/icons/AccountBox'
import FavoriteIcon from '@material-ui/icons/FavoriteBorder'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Badge from '@material-ui/core/Badge'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
   },
   button: {
      margin: theme.spacing(1),
   },
   heading: {
      marginTop: theme.spacing(1),
   },
   column: {

   },
}))

const Profile = ({ fuser, postUser, getLikes }) => {

   const classes = useStyles()

   const url = 'http://localhost:3003' // Node server

   const [displayName, setName] = useState('')
   const [email, setEmail] = useState('')
   const [location, setLoc] = useState('')
   const [photoUrl, setPic] = useState('')
   const [likes, setLikes] = useState('')

   useEffect(() => {

      axios.get(url + '/user?uid=' + fuser.uid)
         .then(res => {
            setName(res.data.displayName)
            setEmail(fuser.email)
            setLoc(res.data.location)
            setPic(res.data.photoUrl)
         })

      getLikes()
         .then(res => setLikes(res.data.likes))
         .catch(err => console.log(err))
   }, [getLikes, fuser.email, fuser.uid])

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
         <Card className='profile'>
            <div className={classes.heading}>
               <Typography className={classes.heading}>Personal stats</Typography>
            </div>
            <div className={classes.column}>
               <div className={classes.avatar}>
                  {photoUrl !== '' ?
                     <Fab
                        color="secondary"
                        aria-label="Add"
                        className={classes.button}>
                        <AddIcon />
                     </Fab> : <img src={photoUrl} alt='avatar' />}
               </div>
               <div className={classes.details}>
                  <CardContent>
                     <span className={classes.button}>
                        <Badge
                           badgeContent={likes}
                           color="secondary">
                           <FavoriteIcon /></Badge>
                     </span>
                     <span className={classes.button}>
                        <Badge
                           badgeContent={null}
                           color="secondary">
                           <AcountBoxIcon /></Badge>
                     </span>
                  </CardContent>
               </div>
            </div>
         </Card>

         <ExpansionPanel defaultExpanded className='profile'>
            <ExpansionPanelSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1c-content"
               id="panel1c-header"
               className='profilerow'>
               <Typography className={classes.heading}>Personal info</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className='profilecolumn'>
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
   )
}

export default Profile