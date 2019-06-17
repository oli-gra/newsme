import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

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
            <Button
               variant="contained" color="secondary" className={classes.button}
               size='large'
               component="span"
            >Image
         </Button>
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