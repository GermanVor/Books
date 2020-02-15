import React from 'react';
import Authors from './Authors'
import Books from './Books'
import AuthorCard from '../js/components/Authors/AuthorCard'
import BookCard from '../js/components/Books/BookCard'

import { 
  HashRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const Toggle = ()=>{
    return (<div className='Toggle'>
       <HashRouter>
        <div className='head'>
          <Link to={'/' }><button type="button" className="btn btn-danger" >Авторы</button></Link>
          <Link to={'/books' }><button type="button" className="btn btn-warning" >Книги</button></Link>
        </div>
        <Switch  >
            <Route exact path={'/' }component={Authors} />
            <Route path={'/books' } component={Books} />
            <Route path={'/author' } component={AuthorCard} />
            <Route path={'/book' } component={BookCard} />
        </Switch>
      </HashRouter>
    </div>)
}

export default Toggle