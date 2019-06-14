import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import Post from './Post'

import '../style/app.css'

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
   }
}))

const PostBox = ({ newsId, userId, handlePostBox }) => {

   const url = 'http://localhost:3003' // Node server

   const classes = useStyles()

   const [posts, setPosts] = useState([])
   const [post, setPost] = useState('')


   useEffect(() => {
      if (newsId) { getPosts(newsId) }
   })

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
      <div className='postbox'>
         <h1>Posts</h1>
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
         {
            posts.length > 0 ? posts.map(post => <Post
               key={post._id}
               post={post}
            />) : 'Be the first'
         }
      </div>)
}


export default PostBox