import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as firebase from 'firebase/app'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import FavoriteIcon from '@material-ui/icons/FavoriteBorder'
import SubjectIcon from '@material-ui/icons/Subject'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Badge from '@material-ui/core/Badge'
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
   textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
   },
   button: {
      margin: theme.spacing(1),
   },
   input: {
      display: 'none',
   },
   heading: {
      marginLeft: theme.spacing(3),
      marginTop: theme.spacing(2),
   },
   profile: {
      width: '60%',
   },
   profilecontainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
   },
   avatar: {
      width: '4em',
      height: '4em',
   },
   wrapper: {
      display: 'flex',
      justifyContent: 'space-between',
   },
   column: {
      minWidth: '10%',
   },
   row: {
      display: 'flex',
      flexDirection: 'row',
   }
}))

const Profile = ({ fuser, postUser, getLikes, getFollows, getBlasts }) => {

   const classes = useStyles()

   const url = 'http://localhost:3003' // Node server

   const [displayName, setName] = useState('')
   const [email, setEmail] = useState('')
   const [location, setLoc] = useState('')
   const [photoUrl, setPic] = useState('')
   const [likes, setLikes] = useState([])
   const [tags, setTags] = useState([])
   const [follows, setFollows] = useState([])
   const [blasts, setBlasts] = useState([])

   const file = React.useRef()

   useEffect(() => {
      axios.get(url + '/user?uid=' + fuser.uid)
         .then(res => {
            console.log(res)
            setName(res.data.displayName)
            setEmail(fuser.email)
            setLoc(res.data.location)
            setPic(res.data.photoUrl)
            setTags(res.data.tags)
         })

      getFollows()
         .then(res => setFollows(res.data.follows))
         .catch(err => console.log(err))

      getBlasts()
         .then(res => setBlasts(res.data.blasts))
         .catch(err => console.log(err))

      getLikes()
         .then(res => setLikes(res.data.likes))
         .catch(err => console.log(err))
   }, [getLikes, fuser.email, fuser.uid, getFollows, getBlasts])


   const saveInput = e => {
      e.preventDefault()
      if (file.current.files[0]) {
         const storageRef = firebase.storage().ref()
         const imageRef = storageRef.child(file.current.files[0].name)
         imageRef.put(file.current.files[0])
            .then(() => console.log(`✅ uploaded ${imageRef.fullPath}`))
            .then(() => storageRef.child(file.current.files[0].name).getDownloadURL())
            .then(url => {
               console.log(url)
               let user = {
                  uid: fuser.uid,
                  displayName: displayName,
                  email: email,
                  location: location,
                  photoUrl: url,
               }
               postUser(user)
            })
      }
   }

   const handleDelete = () => {

   }
   let avatar
   if (!photoUrl) {
      avatar = <><input
         accept="image/*"
         className={classes.input}
         id="outlined-button-file"
         type="file"
         ref={file}
      />
         <label htmlFor="outlined-button-file">
            <Fab
               size="large"
               color="secondary"
               component="span"
               className={classes.button}><AddIcon />
            </Fab>
         </label></>
   }
   else {
      avatar =
         <Avatar className={classes.avatar}>
            <img src={photoUrl} alt='avatar' />
         </Avatar>
   }

   return (
      <div className={classes.profilecontainer}>
         <Card className={classes.profile}>
            <div>
               <Typography className={classes.heading}>stats</Typography>
            </div>
            <div className={classes.wrapper}>
               <CardContent className={classes.column}>
                  {avatar}
               </CardContent>
               <CardContent className={classes.column}>
                  {tags.map(tag => <Chip
                     key={tag}
                     label={tag}
                     onDelete={handleDelete}
                     className={classes.chip}
                     color="secondary"
                  />)}
               </CardContent>
            </div>
            <CardContent className={classes.row}>
               <div className={classes.button}>

                  <Badge
                     badgeContent={likes}
                     color="secondary">
                     <FavoriteIcon /></Badge>
                  <span className={classes.textField}>likes</span>
               </div>
               <div className={classes.button}>
                  <Badge
                     badgeContent={follows}
                     color="secondary">
                     <SupervisorAccountIcon /></Badge>
                  <span className={classes.textField}>follows</span>
               </div>
               <div className={classes.button}>
                  <Badge
                     badgeContent={blasts}
                     color="secondary">
                     <SubjectIcon /></Badge>
                  <span className={classes.textField}>blasts</span>
               </div>
            </CardContent>
         </Card>

         <ExpansionPanel className={classes.profile}>

            <ExpansionPanelSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1c-content"
               id="panel1c-header"
               className='profilerow'>
               <Typography>private</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails className='profilecolumn'>
               <form onSubmit={saveInput}>
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