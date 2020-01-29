import React, { Component } from "react";

class Chosen extends Component {
  constructor(props){
    super(props);
    this.state = {
      SeachValue: '',
      pool: []
    }
   
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }
  componentDidMount(){
    fetch('/api/author/searchInfo')
    .then(response => response.json())
    .then( res=>this.setState({ pool: res.data }) )
  }

  handleChangeSearch(event){
    let value =  event.target.value
    this.setState({SeachValue: value});
    
    let arr = this.state.pool.filter( ({name}) => name.toLowerCase().indexOf(value.toLowerCase()) == 0 );
    console.log(arr)
  }
  
  render(){
    
    return (
      <div className='search box'>
        <form >
            <input type="text" value={this.state.SeachValue} onChange={this.handleChangeSearch} 
              autoComplete="off" name="contributor_text" placeholder="Начните вводить автора"
              aria-autocomplete="list" aria-haspopup="false" aria-expanded="false"/>
        </form>
        <ul>
          {this.state.pool.map( a => <li className='NloOne' author_id={a.author_id} >{a.name}</li>)}
        </ul>
        
      </div>
    );
  }
}

export default Chosen