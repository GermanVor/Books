import React, { Component } from "react";
import { Link } from 'react-router-dom';

class Chosen extends Component {
  constructor(props){
    super(props);
    this.state = {
      SeachValue: '',
      pool: []
    }
   
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.Focus = this.Focus.bind(this);
    this.Blur = this.Blur.bind(this);
  }
  componentDidMount(){}

  handleChangeSearch(event){
    let value =  event.target.value;
    this.setState({SeachValue: value});
    
    fetch('/api/books/searchInfo?value=' + value.trim())
    .then(response => response.json())
    .then( res=>this.setState({ pool: res.data }), () => this.setState({ pool: [] }) )
    
  }
  Blur(event){
    let a = document.querySelector('.Chosen div.dropdown-menu.show');

    if( a && event.nativeEvent && event.nativeEvent.relatedTarget && event.nativeEvent.relatedTarget.offsetParent.classList.contains('dropdown-menu'))
    return 
    else if(a) a.classList.remove('show')
  }
  Focus(){
    let a = document.querySelector('.Chosen div.dropdown-menu:not(.show)')
    if( a && this.state.pool && this.state.pool.length )  a.classList.add('show')
  }
  
  render(){
    return (
      <div className={'search box Chosen '+ this.props.class }>
        <form >
            <input type="text" value={this.state.SeachValue} onChange={this.handleChangeSearch} 
              autoComplete="off" name="contributor_text" placeholder="Начните вводить автора"
              aria-autocomplete="list" aria-haspopup="false" aria-expanded="false"
              className="" onBlur={this.Blur} onFocus={this.Focus}/>
        </form>
        <div className="dropdown " >
          <div className={"dropdown-menu "+ (this.state.pool && this.state.pool.length? 'show': '' ) } aria-labelledby="dropdownMenuButton">
            {this.state.pool.map( (a, ind) => <Link to={{pathname: '/book', id: a.id }} className="dropdown-item" key={'Chosen-'+ind}>
            {a.title+' '+a.genre}
            </Link>)}
          </div>
        </div>
      </div>
    );
  }
}

export default Chosen