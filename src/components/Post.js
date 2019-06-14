import React from 'react'

const Post = ({ post }) =>
   <>
      <div className='post'>
         <div className='postcontent'>
            {post.content}
         </div>
         <div className='postmeta'>
            <div className='postlikes'>{post.likes ? post.likes.length : 0}</div>
            <div className='postdate'>{post.date.slice(0, 10)}</div>
            <div className='postuser'></div>
         </div>
      </div>
   </>

export default Post