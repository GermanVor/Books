import React, { Component } from 'react';

class PopUP extends  Component{
  constructor(props){
      super(props);
      this.ref = React.createRef();
  }

  componentDidMount() {
    this.ref.current.focus();
  }

  render(){
    console.log( this.props )
    let {title, genre, description} = this.props.book
    return (
      <div className="b-popup PopUp" >
          <div className="b-popup-content" onBlur={this.props.del} tabIndex="1"  ref={this.ref}>
            <h1 className='PopUpHead' >{name}</h1>
            <div className='info'>
              {title + ' ' + genre + ' ' + description}
            </div>
            <div className='Books'>
              <ul>
                {this.props.authors.map( (el,ind) => 
                  <li key={'PopUpAuhorKey-'+ind} author_id={el.id}>
                    {el.name + ' всякая другая инфа об авторе '}
                  </li>
                )}
              </ul>
            </div>
          </div>
    </div>)
  }
}

export default PopUP