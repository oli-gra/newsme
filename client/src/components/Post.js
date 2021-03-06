import React, { useEffect } from 'react'

// styling
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FavoriteIcon from '@material-ui/icons/FavoriteBorder'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
   root: {
      backgroundColor: 'transparent',
   },
   img: {
      minWidth: '100%',
      maxHeight: '40vh',
   },
}))

const Post = ({ post, getNews, updatePost, numPosts }) => {
   const classes = useStyles();

   const [expanded, setExpanded] = React.useState(null);
   const node = React.useRef()

   const handleChange = panel => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : 0);
   }

   useEffect(() => {
      const handleClick = e => {
         if (!node.current.contains(e.target)) {
            setExpanded(null)
         }
      }
      document.addEventListener("mousedown", handleClick)
      return () => {
         document.removeEventListener("mousedown", handleClick)
      }
   }, [])

   let icon
   let dots
   let summary
   let content
   if (post.content.startsWith('https')) {
      console.log('true')
      content = <img className={classes.img} src={post.content} alt={post.content} />
   } else { content = <>{post.content}</> }
   if (post.content.length > 50) {
      icon = <ExpandMoreIcon />
      dots = '...'
   }
   if (expanded !== post.id) {
      summary = <ExpansionPanelSummary
         expandIcon={icon}
         className='postheader'
      >{post.content.slice(0, 40)}{dots}
      </ExpansionPanelSummary>
   }

   return (
      <ExpansionPanel
         ref={node}
         className={classes.root}
         square
         onChange={handleChange(post.id)}
         expanded={expanded === post.id}>
         {summary}
         <ExpansionPanelDetails className='postcontent'>
            {content}
         </ExpansionPanelDetails>
         <div className='postlikes'>
            <BottomNavigation
               className={classes.root}>
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