import React, { PureComponent } from 'react'


const algoliasearch = require('../')
const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76')
const index = client.initIndex('contacts')


class Search extends PureComponent {

   state = {
      hits: 0,
      news: {}
   }

   searchUser = search => {
      index.search(search, (err, results) => {
         if (err) throw err
         this.setState({ hits: results.nbHits, news: results.hits })
      })
   }

   componentWillUnmount() {
      client.destroy()
   }

   render() {
      const { hits, news } = this.state
      return (
         <React.Fragment>
            {`Found: ${hits}`}
         </React.Fragment>
      )
   }
}

export default Search