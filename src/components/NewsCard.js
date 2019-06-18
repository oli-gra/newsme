import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge'
import FavoriteIcon from '@material-ui/icons/FavoriteBorder'
import AcountBoxIcon from '@material-ui/icons/AccountBox'
import ChatBubbleIcon from '@material-ui/icons/ChatBubbleOutline'

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

const NewsCard = ({ news, getNews, handlePostBox, handleNewsLike }) => {

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
               onClick={() => getNews(news.uid)}
               value={news.uid}
               icon={<AcountBoxIcon />} />
         </BottomNavigation>
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