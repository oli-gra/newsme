import React from 'react'
import Login from './Login'

const NotFoundPage = ({ user, handleLogin }) =>
   <>

      {user && user.validEmail ? <><h1>Loading...</h1></> : <Login handleLogin={handleLogin} />}
   </>

export default NotFoundPage