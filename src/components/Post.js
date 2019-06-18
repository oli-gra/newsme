import React from 'react'

// styling
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FavoriteIcon from '@material-ui/icons/FavoriteBorder'
import AcountBoxIcon from '@material-ui/icons/AccountBox'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
   root: {
      backgroundColor: 'transparent',
   },
}))


const Post = ({ post, getNews, updatePost, numPosts }) => {
   const classes = useStyles();

   const [expanded, setExpanded] = React.useState(null);
   const handleChange = panel => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
   }

   let icon
   let dots
   if (post.content.length > 50) {
      icon = <ExpandMoreIcon />
      dots = '...'
   }

   return (
      <ExpansionPanel
         className={classes.root}
         square
         onChange={handleChange(post.id)}
         expanded={expanded === post.id}>
         <ExpansionPanelSummary
            expandIcon={icon}
            className='postheader'
         >{post.content.slice(0, 40)}{dots}
         </ExpansionPanelSummary>
         <ExpansionPanelDetails className='postcontent'>
            {post.content.slice(40)}
         </ExpansionPanelDetails>
         <div className='postlikes'>
            <BottomNavigation
               className={classes.root}>
               <BottomNavigationAction
                  label="User"
                  onClick={() => getNews(post.uid)}
                  value={post.uid}
                  icon={<AcountBoxIcon />} />
               <BottomNavigationAction
                  label="Like"
                  onClick={() => {
                     updatePost(post._id)
                  }}
                  value={post.likes.length}
                  icon={<Badge
                     badgeContent={post.likes.length}
                     color="secondary"><FavoriteIcon /></Badge>} />

            </BottomNavigation>
         </div>

      </ExpansionPanel>
   )
}


export default Post