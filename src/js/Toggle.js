import React, { Component } from 'react';
import Author from './Author'
import Book from './Book'

import { 
  HashRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';

class Toggle extends  Component{
  constructor(props){
      super(props);
      this.state = {
        
      }
     
  }
  
  render(){
    return (<div className='Toggle'>
       <HashRouter>
        <Link to={'/authos' }>Авторы</Link>
        <Link to={'/books' }>Книги</Link>
        <Switch  >
            <Route path={'/authos' } render={() => <Author />} />
            <Route path={'/books' } render={() => <Book />}/>
        </Switch>
      </HashRouter>
    </div>)
  }
}

export default Toggle