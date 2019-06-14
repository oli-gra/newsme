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

const InputNews = ({ out }) => {

   const classes = useStyles()

   const handleSubmit = e => {
      e.preventDefault()
      out(fileInput.current.files[0], headline.current.value)
      e.target.reset()
   }

   const fileInput = React.createRef()
   const headline = React.createRef()

   return (
      <form
         onSubmit={handleSubmit}
      >
         <TextField
            id="outlined-name"
            label='Headline'
            className={classes.textField}
            ref={headline}
            margin="normal"
            variant="outlined"
         />
         <input
            accept="image/*"
            className={classes.input}
            id="outlined-button-file"
            type="file"
            ref={fileInput}
         />
         <label htmlFor="outlined-button-file">
            <Button
               variant="outlined"
               component="span"
               className={classes.button}>
               Image
         </Button>
         </label>
         <Button
            variant="outlined"
            size="medium"
            className={classes.button}
            type="submit">
            Add
         </Button>
      </form>
   );
}


export default InputNews;