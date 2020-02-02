import React, { Component } from "react";
import Chosen from './components/Chosen'
import Pagination from './components/Pagination'

import PopUp from './components/authorPopUp'

class Author extends Component {
  constructor(props){
    super(props);
    this.state = {
      authors: [],
      authorDBSize: 0,
      SeachValue: '',
      limit: 5,
      popup: ''
    }
    this.PaginClick = this.PaginClick.bind(this);
    this.sortAZ = this.sortAZ.bind(this);
    this.sortZA = this.sortZA.bind(this);
    this.InfoPopUp = this.InfoPopUp.bind(this);
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
    
    let limit = this.state.limit;
    fetch('/api/author?limit='+limit+'&page=0')
    .then(response => response.json())
    .then( res=>this.setState({ authors: res.data || [] }) )

    fetch('/api/author/info')
    .then(response => response.json())
    .then(res=>this.setState({ authorDBSize: res.data } ))

  }

  PaginClick(limit, ind){
    fetch('/api/author?limit='+limit+'&page='+ind)
    .then(response => response.json())
    .then( res=>this.setState({ authors : res.data }) )
  } 
  async InfoPopUp(event){
    let target = event.target;
    let id = target.getAttribute('author_id');

    let author;
    let books;
    await fetch('/api/author/'+id)
    .then(response => response.json())
    .then( res => {author = res.data})
    
    await fetch('/api/book/authorbooks/'+id)
    .then(response => response.json())
    .then( res => {books = res.data})

    this.setState({ popup: <PopUp
        author = { author }
        del = { ()=> this.setState({popup: ''})}
        books = { books }
    />}) 
  }
  render(){
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
        {this.state.popup}
        <ul>{
          this.state.authors.map( (el, ind) => 
            <li key={'book-key-'+ind}  >
              {el.name +' '+ el.description +'  |  ' + el.id + ' '}
              <button onClick={this.InfoPopUp} author_id = {el.id} >больше информации</button>
            </li>
          )
        }</ul>
        
        {this.state.authorDBSize ? <Pagination 
          DBSize = {this.state.authorDBSize} 
          onClick = {this.PaginClick}
          limit = {this.state.limit}
        />: ''}

        <br/>
        {/* <PopUp /> */}
      </div>
    )
  }
}

export default Author

// fetch('/api/author', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({name: 'acfbbn', description: 'FAEqbz'})
//     })

// fetch('/api/book', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//        title : 'Biba',
//        rating: 4,
//        genre: 'Ужас',
//        description: 'Ужасный ужастик',
//        authors: [
//          {name: 'Артем', description: 'описание артема'},
//          {name: 'Женя', description: 'описание жени'}
//        ]
//       })
//     }).then(response => response.json())
//     .then(console.log)