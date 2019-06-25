import React from 'react'

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge'
import FavoriteIcon from '@material-ui/icons/FavoriteBorder'
import AcountBoxIcon from '@material-ui/icons/AccountBox'
import ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline'
import Menu from '@material-ui/core/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
   margin: {
      margin: theme.spacing(0.1),
   },
   padding: {
      padding: theme.spacing(0, 1),
   },
   root: {
      backgroundColor: 'rgba(30,30,30,0.8)',
   },
}))

const NewsCard = ({ news, getNews, handlePostBox, handleNewsLike, followUser }) => {

   const classes = useStyles();

   const [hover, setHover] = React.useState(false)

   const handleHover = () =>
      setHover(!hover)


   let title
   let footer
   const style = {
      backgroundImage: 'url(' + news.image + ')'
   }
   if (hover && news._id !== 1) {
      title = <div className='newscardtitle'>{news.title}</div>
   }
   if (news._id !== 1) {
      footer =
         <PopupState variant="popover" popupId="demo-popup-menu">
            {popupState => (
               <>
                  <BottomNavigation
                     className={classes.root}>

                     <BottomNavigationAction
                        label="Like"
                        onClick={handleNewsLike}
                        value={news.likes.length}
                        icon={<Badge
                           className={classes.margin}
                           badgeContent={news.likes.length}
                           color="secondary"><FavoriteIcon /></Badge>} />

                     <BottomNavigationAction
                        label="Post"
                        onClick={handlePostBox}
                        value={news.posts.length}
                        icon={<Badge
                           className={classes.margin}
                           badgeContent={news.posts.length}
                           color="secondary"><ChatBubbleIcon />
                        </Badge>} />
                     <BottomNavigationAction
                        label="User"
                        value={news.uid}
                        {...bindTrigger(popupState)}
                        icon={<AcountBoxIcon />} />
                  </BottomNavigation>
                  <Menu {...bindMenu(popupState)}>
                     <MenuItem onClick={() => {
                        getNews(news.uid)
                        popupState.close()
                     }}>news</MenuItem>
                     <MenuItem onClick={() => {
                        followUser()
                        popupState.close()
                     }}>follow</MenuItem>
                  </Menu>
               </>
            )}
         </PopupState>
   }

   return (
      <div
         className='newscard'
         style={style}
         onMouseEnter={handleHover}
         onMouseLeave={handleHover}
      >
         {title}
         <div className='newscardfoot'>
         </div>
         {footer}
      </div>
   )
}

export default NewsCard