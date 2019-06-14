import React, { PureComponent } from 'react'
import InputUrl from './InputUrl'
import InputNews from './InputNews'

class AddNews extends PureComponent {

   scrapeNews = newsUrl => {
      const api = '5cf66e9a3ee398f1413c110295f3ea61b667558c6f9b8'
      const url = `http://api.linkpreview.net/?key=${api}&q=${newsUrl}`
      return fetch(url)
         .then(response => response.json())
         .then(data => this.props.handleNews(data))
   }

   handleFile = (file, headline) =>
      this.props.handleFile(file, headline)

   render() {
      return (
         <div className='addnews'>
            <div className='addurl'>
               <InputUrl
                  in={'news url'}
                  out={this.scrapeNews} />
            </div>
            <div className='addfile'>
               <InputNews
                  out={this.handleFile}
               />
            </div>
         </div>
      );
   }
}

export default AddNews;