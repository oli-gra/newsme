import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Post from './Post'
import List from '@material-ui/core/List';


import '../style/app.css'

const useStyles = makeStyles(theme => ({
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
   },
   dense: {
      marginTop: theme.spacing(1),
   },
   list: {
      marginBottom: theme.spacing(2),
   }
}))

const PostBox = ({ newsId, userId, handlePostBox }) => {

   const url = 'http://localhost:3003' // Node server

   const classes = useStyles()

   const [posts, setPosts] = useState([])
   const [post, setPost] = useState('')

   const node = React.useRef()

   const handleClick = e => {
      if (!node.current.contains(e.target)) {
         return handlePostBox()
      }
   }

   useEffect(() => {
      document.addEventListener("mousedown", handleClick)
      return () => {
         document.removeEventListener("mousedown", handleClick)
      }
   }, [])

   useEffect(() => {
      if (newsId) { getPosts(newsId) }
   }, [])

   const getPosts = newsId =>
      axios.get(url + '/posts?nid=' + newsId)
         .then(res => setPosts(res.data))
         .catch(err => console.log(err))

   const postPost = post =>
      axios.post(url + '/posts/new', post).then(res => res.data.ops[0])

   const handleChange = post =>
      setPost(post)

   const handleEnter = e => {
      if (e.keyCode === 13) {
         let post = {
            content: e.target.value,
            uid: userId,
            nid: newsId,
         }
         postPost(post).then(post => setPosts([...posts, post]))
      }
   }

   return (
      <div className='postbox' ref={node}>
         <TextField
            id="outlined-name"
            label='post'
            className={classes.textField}
            type='text'
            value={post}
            onChange={event => handleChange(event.target.value)}
            onKeyDown={event => handleEnter(event)}
            margin="normal"
            variant="outlined"
         />
         <List className={classes.list}>
            {posts.map(post => <Post id={post.id} post={post} />)}
         </List>
         {/* <ListSubheader className={classes.subheader}>Today</ListSubheader>} */}


      </div>)
}


export default PostBox