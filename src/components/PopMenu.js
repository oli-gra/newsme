import React, { useEffect } from 'react'
import { navigate } from 'hookrouter'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import ExitToApp from '@material-ui/icons/ExitToApp'
import AccountBox from '@material-ui/icons/AccountBox'

const PopMenu = ({ handlePopMenu, signOut }) => {

   const node = React.useRef()

   useEffect(() => {

      const handleClick = e => {
         if (!node.current.contains(e.target)) {
            return handlePopMenu()
         }
      }

      document.addEventListener("mousedown", handleClick)
      return () => {
         document.removeEventListener("mousedown", handleClick)
      }
   }, [handlePopMenu])

   return (
      <div className='popmenu' ref={node}>
         <List
            component="nav"
         >
            <ListItem button onClick={() => {
               navigate('/')
            }}>
               <ListItemIcon>
                  <HomeIcon />
               </ListItemIcon>
               <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => {
               navigate('/new')
            }}>
               <ListItemIcon>
               </ListItemIcon>
               <ListItemText primary="Add news" />
               {/* {open ? <ExpandLess /> : <ExpandMore />} */}
            </ListItem>
            <ListItem button onClick={() => {
               navigate('/profile')
            }}>
               <ListItemIcon>
                  <AccountBox />
               </ListItemIcon>
               <ListItemText primary="Personal info" />
            </ListItem>
            <ListItem button onClick={() => signOut()}>
               <ListItemIcon>
                  <ExitToApp />
               </ListItemIcon>
               <ListItemText primary="Logout" />
            </ListItem>
         </List>
      </div>
   )
}

export default PopMenu