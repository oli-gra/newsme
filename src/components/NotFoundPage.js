import React from 'react'
import Login from './Login'

const NotFoundPage = ({ user, handleLogin }) => {
   let message
   user ? message = <h1>not found</h1> : message = <Login
      handleLogin={handleLogin}
   />

   return { message }
}

export default NotFoundPage