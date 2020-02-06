import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const PopUP = (props) => {
  let {description, name, books} = props.author;
  return (
    <div className="b-popup PopUp" onClick={props.del} >
        <div className="b-popup-content" onClick={ (event)=>event.stopPropagation() }>
          <h1 className='PopUpHead' ><em>{name}</em></h1>
          <div className='info'>
            {description}
          </div>
          {props.books && props.books.length ?<div className='Books'>
          <h1>{props.books.length===1?'Книга':'Книги'}</h1>
            <div>
              {props.books.map( (el,ind) =>
                <div key={'PopUpBookKey-'+ind} book_id={el.id}>
                  {el.title+' '}
                  <Link to={{pathname: '/book', id: el.id }} > узнать больше </Link>
                </div>
              )}
            </div>
          </div>: ''}
        </div>
  </div>)
}

export default PopUP