import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const PopUP = (props) => {
  let {description, name} = props.author;
  return (
    <div className="b-popup PopUp" onClick={props.del} >
        <div className="b-popup-content" onClick={ (event)=>event.stopPropagation() }>
          <h1 className='PopUpHead' >{name}</h1>
          <div className='info'>
            {description}
          </div>
          <div className='Books'>
            <ul>
              {props.books.map( (el,ind) =>
                <li key={'PopUpBookKey-'+ind} book_id={el.id}>
                  {el.title+' '}<Link to={{pathname: '/book', id: el.id }} >всякая другая инфа о книге</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
  </div>)
}

export default PopUP