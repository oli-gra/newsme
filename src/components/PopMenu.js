import React, { PureComponent } from 'react';
import { navigate } from 'hookrouter'
import ReactDOM from 'react-dom'

class PopMenu extends PureComponent {

   componentDidMount() {
      document.addEventListener('click', this.handleClick, true);
   }

   componentWillUnmount() {
      document.removeEventListener('click', this.handleClick, true);
   }

   handleClick = event => {
      const domNode = ReactDOM.findDOMNode(this);
      if (!domNode || !domNode.contains(event.target)) {
         this.props.handlePopMenu()
      }
   }

   render() {
      return (
         <div className='popmenu'>
            <nav>
               <ul>
                  <li onClick={() => navigate('/')}>News</li>
                  <li onClick={() => navigate('/new')}>Add</li>
                  <li onClick={() => navigate('/profile')}>Profile</li>
               </ul>
            </nav>
         </div>)
   }
}

export default PopMenu