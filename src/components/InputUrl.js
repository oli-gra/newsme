import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
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
      width: 300,
   },
}))


const InputUrl = ({ handleUrl }) => {

   let url = React.useRef()

   const classes = useStyles()
   return (

      <form className={classes.container} noValidate autoComplete="off">
         <TextField
            id="outlined-name"
            label='News url'
            className={classes.textField}
            onChange={e => url = e.target.value}
            margin="normal"
            variant="outlined"
         />
         <ExpansionPanelActions>
            <div className={classes.column} />
            <div className='rightbutton'>
               <Button
                  variant="contained"
                  color="secondary"
                  size='large'
                  className={classes.button}
                  onClick={() => handleUrl(url)}
               >
                  Save
               </Button>
            </div>


         </ExpansionPanelActions>
      </form>

   );
}

export default InputUrl