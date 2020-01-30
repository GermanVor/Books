import React, { Component } from "react";
import Chosen from './components/Chosen'
import Pagination from './components/Pagination'

class Author extends Component {
  constructor(props){
    super(props);
    this.state = {
      authors: [],
      authorDBSize: 0,
      SeachValue: '',
      limit: 5
    }
    this.PaginClick = this.PaginClick.bind(this);
    this.sortAZ = this.sortAZ.bind(this);
    this.sortZA = this.sortZA.bind(this);
  }
  /**
	 * @returns Array
	 */
  sort(arr, key, isIncrease = 1){
    return arr.sort( function (a, b) {
      if (a[key] > b[key]) return isIncrease;
      if (a[key] < b[key]) return -isIncrease;
      return 0;
    } )
  }
  sortAZ(){
    this.setState({ authors: this.sort(this.state.authors, 'name') })
  }
  sortZA(){
    this.setState({ authors: this.sort(this.state.authors, 'name', -1) })
  }
  componentDidMount(){
    // fetch('/api/author', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8'
    //   },
    //   body: JSON.stringify({name: 'ziga', description: 99})
    // })
    // .then(response => response.json())
    // .then(console.log)
    //let setState = this.setState.bind(this);  
    let limit = this.state.limit;
    fetch('/api/author?limit='+limit+'&page=0')
    .then(response => response.json())
    .then( res=>this.setState({ authors: res.data }) )

    fetch('/api/author/info')
    .then(response => response.json())
    .then(res=>this.setState({ authorDBSize: res.data } ))

  }

  PaginClick(limit, ind){
    fetch('/api/author?limit='+limit+'&page='+ind)
    .then(response => response.json())
    .then( res=>this.setState({ authors : res.data }) )
  } 
  
  render(){
    console.log(this.state)
    return (
      <div className="Author">
        Author
        <div className='AuthorMenu'>
          <div className='sortBox box'>
            <button onClick={this.sortAZ} >A...Z</button>
            <button onClick={this.sortZA} >Z...A</button>
          </div>
          
            <Chosen onChange={value => console.log(value)} searchRef={'/api/author/searchInfo?value='}/>
           
        </div>
        <ul>{
          this.state.authors.map( (el, ind) => 
            <li key={'book-key-'+ind} author_id = {el.author_id} >
              {el.name +' '+ el.description +' '+ el.author_id}
            </li>
          )
        }</ul>
        
        {this.state.authorDBSize ? <Pagination 
          DBSize = {this.state.authorDBSize} 
          onClick = {this.PaginClick}
          limit = {this.state.limit}
        />: ''}

        <br/>
      </div>
    )
  }
}

export default Author