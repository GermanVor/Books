import React, { Component } from "react";
import Chosen from './components/Books/bookChosen'
import Pagination from './components/Pagination'

import PopUp from './components/Books/bookPopUp'

class Books extends Component {
  constructor(props){
    super(props);
    let obj = JSON.parse(sessionStorage.getItem('Book'))
    let l = undefined, p = undefined;
    if( obj ){
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
    this.InfoPopUp = this.InfoPopUp.bind(this);
    this.sortRating = this.sortRating.bind(this);
    this.sortTitle = this.sortTitle.bind(this)
  }
  sort(arr, key, isIncrease = 1){
    return arr.sort( function (a, b) {
      if (a[key] > b[key]) return isIncrease;
      if (a[key] < b[key]) return -isIncrease;
      return 0;
    } )
  }
  sortTitle(event, r){
    this.setState({ books: this.sort(this.state.books, 'title',r) })
  }
  sortRating(event, r){
    this.setState({ books: this.sort(this.state.books, 'rating',r) })
  }
  componentDidMount(){
    fetch('/api/books?limit='+this.limit+'&page='+this.page)
    .then(response => response.json())
    .then( res=>this.setState({ books: res.data || [] }) )

    fetch('/api/books/info')
    .then(response => response.json())
    .then(res=>this.setState({ bookDBSize: res.data } ))
  }
  PaginClick(limit, page){
    sessionStorage.setItem('Book', JSON.stringify({ limit: limit, page: page}) ) 
    this.limit = limit;
    this.page = page;

    fetch('/api/books?limit='+limit+'&page='+page)
    .then(response => response.json())
    .then( res=>this.setState({ books : res.data || [] }) )
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
        <h1>Books</h1>
        <div className='BooksMenu'>
          <Chosen class='inline-block'/>
          <div className='sortBox box inline-block' >
            <button onClick={()=>this.sortTitle(event,1)} className='btn btn-info'>A...Z</button>
            <button onClick={()=>this.sortTitle(event,-1)} className='btn btn-info'>Z...A</button>
            <button onClick={()=>this.sortRating(event,1)} className='btn btn-info'>Rating Up</button>
            <button onClick={()=>this.sortRating(event,-1)} className='btn btn-info'>Rating Down</button>
          </div>
        </div>
        {this.state.popup}
        <div className='BooksPool Pool'>{
          this.state.books.map( (el, ind) => 
            <div  key={'book-key-'+ind} className="jumbotron jumbotron-fluid">
              <div className="container">
                <div>
                  <h1 className="display-3 inline-block"><em>{el.title}</em></h1>
                  <h2 className="inline-block">{'Рейтинг :'+el.rating}</h2><br/>
                  <button onClick={this.InfoPopUp} book_id = {el.id} className="btn btn-info">больше информации</button>
                </div>
                <hr className="my-2"></hr>
                <p className="lead">{el.genre}</p>
              </div>
            </div>
          )
        }</div>
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
