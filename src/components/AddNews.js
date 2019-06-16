import React from 'react'
import InputUrl from './InputUrl'
import InputFile from './InputFile'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
   heading: {
      fontSize: theme.typography.pxToRem(15),
   },
   secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
   },
   icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
   },
   details: {
      alignItems: 'center',
   },
   column: {
      flexBasis: '33.33%',
   },
   helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
   },
   link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
         textDecoration: 'underline',
      },
   },
}))


const AddNews = ({ handleUrl, handleFile }) => {

   const classes = useStyles()

   return (
      <>
         <div className='addnews'>
            <ExpansionPanel defaultExpanded>
               <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1c-content"
                  id="panel1c-header"
               >
                  <div className={classes.column}>
                     <Typography className={classes.heading}>Paste url</Typography>
                  </div>
               </ExpansionPanelSummary>
               <ExpansionPanelDetails className={classes.details}>
                  <InputUrl handleUrl={handleUrl} />
               </ExpansionPanelDetails>
            </ExpansionPanel>
         </div>
         <div className='addnews'>
            <ExpansionPanel>
               <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1c-content"
                  id="panel1c-header"
               >
                  <div className={classes.column}>
                     <Typography className={classes.heading}>Upload image</Typography>
                  </div>
               </ExpansionPanelSummary>
               <ExpansionPanelDetails className={classes.details}>
                  <InputFile handleFile={handleFile} />
               </ExpansionPanelDetails>
            </ExpansionPanel>
         </div>
      </>
   )
}

export default AddNews;