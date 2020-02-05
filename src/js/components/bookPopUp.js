import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const PopUP = (props) =>{
  let {title, genre, description} = props.book;
  return (
    <div className="b-popup PopUp" onClick={props.del} >
        <div className="b-popup-content" onClick={ (event)=>event.stopPropagation() }>
          <h1 className='PopUpHead' >{name}</h1>
          <div className='info'>
            {title + ' ' + genre + ' ' + description}
          </div>
          <div className='Books'   >
            <ul>
              {props.authors.map( (el,ind) => 
                <li key={'PopUpAuhorKey-'+ind} author_id={el.id}>
                  {el.name+' '}<Link to={{pathname: '/author', id: el.id }} > всякая другая инфа об авторе</Link> 
                </li>
              )}
            </ul>
          </div>
        </div>
  </div>)
}

export default PopUP