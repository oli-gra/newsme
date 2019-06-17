import React from 'react'

// styling
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FavoriteIcon from '@material-ui/icons/FavoriteBorder'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

const Post = ({ post }) => {
   return (
      <ListItem>
         <ListItemText secondary={post.content} />
         <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="Delete">
               <FavoriteIcon />
            </IconButton>
         </ListItemSecondaryAction>
      </ListItem>
   )
}


export default Post