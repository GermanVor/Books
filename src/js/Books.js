import React, { Component } from "react";
import Chosen from './components/bookChosen'
import Pagination from './components/Pagination'

import PopUp from './components/bookPopUp'

class Books extends Component {
  constructor(props){
    super(props);
    let obj = JSON.parse(sessionStorage.getItem('Book'))
    let l = undefined, p = undefined;
    if( obj ){
      console.log(obj)
      l = obj.limit;
      p = obj.page;
    }
    this.limit = l || 3;
    this.page = p || 0;

    this.state = {
      books: [],
      bookDBSize: 0,
      SeachValue: '',
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
    this.setState({ books: this.sort(this.state.books, 'title') })
  }
  sortZA(){
    this.setState({ books: this.sort(this.state.books, 'title', -1) })
  }
  componentDidMount(){
    fetch('/api/books?limit='+this.limit+'&page='+this.page)
    .then(response => response.json())
    .then( res=>this.setState({ books: res.data || [] }) )

    fetch('/api/books/info')
    .then(response => response.json())
    .then(res=>this.setState({ bookDBSize: res.data || [] } ))

  }

  PaginClick(limit, page){
    sessionStorage.setItem('Book', JSON.stringify({ limit: limit, page: page}) ) 
    this.limit = limit;
    this.page = page;

    fetch('/api/books?limit='+limit+'&page='+page)
    .then(response => response.json())
    .then( res=>this.setState({ books : res.data }) )
  }

  async InfoPopUp(event){
    let target = event.target;
    let id = target.getAttribute('book_id');

    let book;
    let authors;
    await fetch('/api/books/'+id)
    .then(response => response.json())
    .then( res => {book = res.data})
    
    await fetch('/api/books/authors-by-book-id/'+id)
    .then(response => response.json())
    .then( res => {authors = res.data})

    this.setState({ popup: <PopUp
        book = { book }
        authors = { authors }
        del = { ()=> this.setState({popup: ''})}
    />}) 
  }
  render(){
    return (
      <div className="Books">
        Books
        <div className='BooksMenu'>
          <div className='sortBox box'>
            <button onClick={this.sortAZ} >A...Z</button>
            <button onClick={this.sortZA} >Z...A</button>
          </div>
          <Chosen />
        </div>
        {this.state.popup}
        <ul>{
          this.state.books.map( (el, ind) => 
            <li key={'book-key-'+ind}  >
              {el.title +' '+ el.description +'  |  ' + el.id + ' '}
              <button onClick={this.InfoPopUp} book_id = {el.id} >больше информации</button>
            </li>
          )
        }</ul>
        
        {this.state.bookDBSize ? <Pagination 
          DBSize = {this.state.bookDBSize} 
          onClick = {this.PaginClick}
          limit = {this.limit}
          page = {this.page}
        />: ''}

        <br/>
      </div>
    )
  }
}

export default Books
