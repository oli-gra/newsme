import React from 'react';

const NotFoundPage = user =>
   <>
      <h1>Loading...</h1>
      {user && user.validEmail ? <></> : <></>}
   </>

export default NotFoundPage