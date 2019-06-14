import React, { useState } from 'react'
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
   grow: {
      flexGrow: 1,
   },
   search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
         backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
         marginLeft: theme.spacing(3),
         width: 'auto',
      },
   },
   searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   inputRoot: {
      color: 'inherit',
   },
   inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
         width: 200,
      },
   },
   sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
         display: 'flex',
      },
   },
   sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
         display: 'none',
      },
   },
}))

const Navbar = ({ popmenu }) => {

   const classes = useStyles();

   const [search, setSearch] = useState(null)

   const handleChange = event =>
      setSearch(event.target.value)


   return (
      <div className='navbar'>
         <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Open drawer"
         >
            <span onClick={popmenu}><MenuIcon /></span>
         </IconButton>

         <div className={classes.search}>
            <div className={classes.searchIcon}>
               <SearchIcon />
            </div>
            <InputBase
               placeholder="Find news or user"
               classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
               }}
               inputProps={{ 'aria-label': 'Search' }}
               value={search}
               onChange={handleChange}
            />
         </div>

         <div className={classes.sectionDesktop}>
            <IconButton aria-label="Show 17 new notifications" color="inherit">
               <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
               </Badge>
            </IconButton>
         </div>
      </div>
   )
}

export default Navbar