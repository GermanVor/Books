import React from 'react';
import { Link } from 'react-router-dom';

const PopUP = (props) => {
  let {name} = props.author;
  return (
    <div className="b-popup PopUp" onClick={props.del} >
        <div className="b-popup-content" onClick={ (event)=>event.stopPropagation() }>
          <h1 className='PopUpHead' ><em>{name}</em></h1>
          {props.books.length ?<div className='Books'>
            { props.top && props.top.length < props.books.length ?
            <div>
              <h2>{'Лушчая пятерка книг'}</h2>
              {props.top.map( (el,ind) =>
                <div key={'PopUpTopBookKey-'+ind} book_id={el.id}>
                  {el.title+' '}
                  <Link to={{pathname: '/book', id: el.id }} > узнать больше </Link>
                </div>
              )}
            </div>
            : ''}
          <h2 >{props.books.length===1?'Произведение':'Произведения:'}</h2>
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