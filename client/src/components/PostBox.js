import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as firebase from 'firebase/app'

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

   const updatePost = pid => {
      axios.patch(`${url}/posts?pid=${pid}&uid=${userId}`)
         .then(res => {
            const likedPost = res.data.value
            const postMap = posts.map(p =>
               p._id === likedPost._id
                  ? p = likedPost
                  : p
            )
            setPosts(postMap)
         })
   }

   const postPost = content => {
      let post = {
         content: content,
         uid: userId,
         nid: newsId,
      }
      return axios.post(url + '/posts/new', post)
         .then(res => res.data.ops[0])
         .then(post => setPosts([post, ...posts]))
         .catch(err => console.log(err))
   }


   const postFile = () => {
      if (file.current.files[0]) {
         const storageRef = firebase.storage().ref()
         const imageRef = storageRef.child(file.current.files[0].name)
         imageRef.put(file.current.files[0])
            .then(() => console.log(`✅ uploaded ${imageRef.fullPath}`))
            .then(() => storageRef.child(file.current.files[0].name).getDownloadURL())
            .then(url => { postPost(url) })
      }
   }

   const handleEnter = e => {
      if (e.keyCode === 13) {
         setPost('')
         postPost(e.target.value)
      }
   }

   const handleChange = e =>
      postFile()

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
            onChange={e => handleChange(e)}
         />
         <label htmlFor="outlined-button-file">
            <Fab
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