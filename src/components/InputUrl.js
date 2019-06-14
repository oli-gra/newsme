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
}))


const InputUrl = ({ out }) => {

   const classes = useStyles()

   const [url, setUrl] = React.useState('')

   const handleSubmit = e => {
      e.preventDefault()
      out(url)
   }


   return (

      <form className={classes.container} noValidate autoComplete="off">
         <TextField
            id="outlined-name"
            label='News url'
            className={classes.textField}
            value={url}
            onChange={e => setUrl(e.target.value)}
            margin="normal"
            variant="outlined"
         />
         <Button
            variant="outlined"
            size="medium"
            className={classes.button}
            type="submit"
            onClick={handleSubmit}>
            add news
         </Button>
      </form>

   );
}

export default InputUrl