import React, { Component } from 'react';
import Author from './Author'
import Book from './Book'

class Toggle extends  Component{
  constructor(props){
      super(props);
      this.state = {
        toggle : true
      }
  }

  render(){
    return (<div className='Toggle'>
      {this.state.toggle? <Author/>: <Book/>}
    </div>)
  }
}

export default Toggle