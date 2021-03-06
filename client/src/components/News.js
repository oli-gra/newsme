import React from 'react'
import NewsCard from './NewsCard'

const News = ({ news, getNews, handlePostBox, handleNewsLike, followUser }) =>
   <div className='news-container'>
      {news !== null ? news.map(news => <NewsCard
         key={news._id}
         news={news}
         getNews={getNews}
         followUser={() => followUser(news.uid)}
         handlePostBox={() => handlePostBox(news._id)}
         handleNewsLike={() => handleNewsLike(news._id)}
      />) : null}
   </div>

export default News