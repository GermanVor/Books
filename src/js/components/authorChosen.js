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
  }
  componentDidMount(){}

  handleChangeSearch(event){
    let value =  event.target.value;
    this.setState({SeachValue: value});
    
    fetch('/api/authors/searchInfo?value=' + value.trim())
    .then(response => response.json())
    .then( res=>this.setState({ pool: res.data }), () => this.setState({ pool: [] }) )
    
  }
  
  render(){
    console.log(this.state.pool)
    return (
      <div className='search box Chosen'>
        <form >
            <input type="text" value={this.state.SeachValue} onChange={this.handleChangeSearch} 
              autoComplete="off" name="contributor_text" placeholder="Начните вводить автора"
              aria-autocomplete="list" aria-haspopup="false" aria-expanded="false"/>
        </form>
        <ul>
          {this.state.pool.map( (a, ind) => <Link to={'/author'}><li author_id={a.id} key={'Chosen-'+ind}>{a.name}</li></Link>)}
        </ul>
      </div>
    );
  }
}

export default Chosen