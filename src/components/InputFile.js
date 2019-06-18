import React from 'react'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

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

const InputNews = ({ handleFile }) => {

   const classes = useStyles()

   const handleSubmit = e => {
      e.preventDefault()
      handleFile(file.current.files[0], title)
      e.target.reset()
   }

   const file = React.useRef()
   let title = React.useRef()

   return (
      <form
         className={classes.container}
         noValidate
         autoComplete="off"
         onSubmit={handleSubmit}
      >
         <TextField
            id="outlined-name"
            label='title'
            className={classes.textField}
            onChange={e => title = e.target.value}
            ref={title}
            margin="normal"
            variant="outlined"
         />
         <input
            accept="image/*"
            className={classes.input}
            id="outlined-button-file"
            type="file"
            ref={file}
         />
         <label htmlFor="outlined-button-file">
            <Fab
               variant="contained"
               color="secondary"
               component="span"
               className={classes.button}>
               <AddIcon />
            </Fab>
            <Button
               variant="contained"
               color="secondary"
               className={classes.button}
               size='large'
               type='submit'
            >Save
         </Button>
         </label>
      </form>
   );
}


export default InputNews;