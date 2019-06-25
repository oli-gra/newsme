import React from 'react'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField'
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
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
   fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
   },
   input: {
      display: 'none',
   },
}))

const InputNews = ({ handleFile }) => {

   const classes = useStyles()

   const [success, setSuccess] = React.useState(false);

   const file = React.useRef()

   const handleSubmit = e => {
      e.preventDefault()
      const title = e.target.title.value
      console.log(title)
      handleFile(file.current.files[0], title)
      e.target.reset()
   }


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
            name='title'
            margin="normal"
            variant="outlined"
         />
         <input
            accept="image/*"
            className={classes.input}
            id="outlined-button-file"
            type="file"
            onChange={() => file.current.files[0] ? setSuccess(true) : <CircularProgress size={68} className={classes.fabProgress} />
            }
            ref={file}
         />
         <label htmlFor="outlined-button-file">

            <Fab
               aria-label="Save"
               color={success ? 'default' : 'secondary'}
               component="span"
               className={classes.button}>
               {success ? <CheckIcon /> : <SaveIcon />}
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