import React from 'react'
import NewsCard from './NewsCard'

const News = ({ news, handlePostBox, handleNewsLike }) =>
   <div className='news-container'>
      {news !== null ? news.map(news => <NewsCard
         key={news._id}
         news={news}
         handlePostBox={() => handlePostBox(news._id)}
         handleNewsLike={() => handleNewsLike(news._id)}
      />) : null}
   </div>



export default News