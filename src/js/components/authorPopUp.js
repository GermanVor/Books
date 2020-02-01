import React, { Component } from 'react';
import ReactDOM from 'react-dom'

class PopUP extends  Component{
  constructor(props){
      super(props);
      this.ref = React.createRef();
  }

  componentDidMount() {
    this.ref.current.focus();
  }

  render(){
    let {description, name} = this.props.author
    return (
      <div className="b-popup PopUp" >
          <div className="b-popup-content" onBlur={this.props.del} tabIndex="1"  ref={this.ref}>
            <h1 className='PopUpHead' >{name}</h1>
            <div className='info'>
              {description}
            </div>
            <div className='Books'>
            
            </div>
          </div>
    </div>)
  }
}

export default PopUP