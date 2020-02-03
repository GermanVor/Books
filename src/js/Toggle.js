import React, { Component } from 'react';
import Authors from './Authors'
import Books from './Books'
import AuthorCard from '../js/components/AuthorCard'

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
        <Link to={'/authors' }>Авторы</Link>
        <Link to={'/books' }>Книги</Link>
        <Switch  >
            <Route path={'/authors' } render={() => <Authors />} />
            <Route path={'/books' } render={() => <Books />}/>
            <Route path={'/author' } render={() => <AuthorCard />}/>
        </Switch>
      </HashRouter>
    </div>)
  }
}

export default Toggle