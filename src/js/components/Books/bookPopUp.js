import React from 'react';
import { Link } from 'react-router-dom';

const PopUP = (props) =>{
  let {title, genre, description, rating} = props.book;
  return (
    <div className="b-popup PopUp" onClick={props.del} >
        <div className="b-popup-content" onClick={ (event)=>event.stopPropagation() }>
          <h1 className='PopUpHead' ><em>{title}</em></h1>
          <div className='info'>
            <p>{'Жанр : '+genre}</p>
            <p>{'Рейтинг : '+rating}</p>
          </div>
          <div className='Books'   >
          <h2>{props.authors.length===1?'Автор':'Авторы:'}</h2>
            <div>
              {props.authors.map( (el,ind) => 
                <div key={'PopUpAuhorKey-'+ind} author_id={el.id}>
                  {el.name+' '}
                  <Link to={{pathname: '/author', id: el.id }} > узнать больше</Link> 
                  <Link to={{pathname: '/authors', id: el.id }} > перейти к вкладке авторы</Link>
                  
                </div>
              )}
            </div>
          </div>
        </div>
  </div>)
}

export default PopUP