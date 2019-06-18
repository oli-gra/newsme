import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Post from './Post'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
   textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      width: '75%',
   },
   dense: {
      marginTop: theme.spacing(1),
   },
   button: {
      marginTop: theme.spacing(3)
   },
   input: {
      display: 'none',
   },
}))

const PostBox = ({ newsId, userId, handlePostBox, getNews }) => {

   const classes = useStyles()
   const url = 'http://localhost:3003' // Node server
   const [posts, setPosts] = useState([])
   const [post, setPost] = useState('')

   const node = React.useRef()
   const file = React.useRef()


   useEffect(() => {
      const handleClick = e => {
         if (!node.current.contains(e.target)) {
            return handlePostBox()
         }
      }
      document.addEventListener("mousedown", handleClick)
      return () => {
         document.removeEventListener("mousedown", handleClick)
      }
   }, [handlePostBox, newsId])

   useEffect(() => {
      if (newsId) { getPosts(newsId) }
   }, [newsId])

   const getPosts = newsId =>
      axios.get(url + '/posts?nid=' + newsId)
         .then(res => setPosts(res.data))
         .catch(err => console.log(err))

   const updatePost = pid =>
      axios.patch(`${url}/posts?pid=${pid}&uid=${userId}`)
         .then(res => {
            const likedPost = res.data.value
            const altPosts = posts.filter(post => post._id !== likedPost._id)
            altPosts.unshift(likedPost)
            setPosts(altPosts)
         })

   const postPost = post =>
      axios.post(url + '/posts/new', post)
         .then(res => res.data.ops[0])
         .then(post => setPosts([...posts, post]))
         .catch(err => console.log(err))

   const handleEnter = e => {
      if (e.keyCode === 13) {
         let post = {
            content: e.target.value,
            uid: userId,
            nid: newsId,
         }
         setPost('')
         postPost(post)
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
            onChange={event => setPost(event.target.value)}
            onKeyDown={event => handleEnter(event)}
            margin="normal"
            variant="outlined"
         />
         <input
            accept="image/*"
            className={classes.input}
            id="outlined-button-file"
            type="file"
            ref={file}
         />
         <label htmlFor="outlined-button-file">
            <Fab
               variant="contained"
               size="small"
               color="secondary"
               component="span"
               className={classes.button}>
               <AddIcon />
            </Fab>
         </label>
         {posts.map(post => <Post
            key={post._id}
            post={post}
            getNews={getNews}
            updatePost={updatePost}
         />)}

      </div>)
}


export default PostBox