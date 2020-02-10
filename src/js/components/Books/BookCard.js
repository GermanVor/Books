import React, { Component } from "react"

class BookCard extends Component {
  constructor(props){
    super(props)
    this.state ={
      book: {},
      authors: []
    }
  }
  componentDidMount () {
    let id = this.props.location.id
    if( id ){
      sessionStorage.setItem('BookCardId', JSON.stringify({ id: id}) ) 
    } else id = JSON.parse(sessionStorage.getItem('BookCardId')).id

    fetch('/api/books/'+id)
    .then(response => response.json())
    .then( res=>this.setState({ book: res.data }) )
    
    fetch('/api/books/authors-by-book-id/'+id)
    .then(response => response.json())
    .then( res =>this.setState({authors: res.data}) )
  }
  render(){
    let { authors, book} = this.state;
    return (
      <blockquote className="blockquote text-center">
      <div className="AuthorCard">
        <h2 className='display-4'><em>{book.title}</em></h2>
        <h3 className='display-5'>{'Жанр : '+book.genre}</h3>
        <h3 className='display-5'>{'Рейтиг : '+book.rating}</h3>
        <br></br>
        <hr className="my-2"></hr>
        <div className='description'><p>{book.description}</p></div>
        <hr className="my-2"></hr>
        <br/>
        {authors.length===1?'Автор':'Авторы'}
        <div>
          {authors.map( (el, ind) => 
            <h1 key={ind}>{el.name}</h1>
          )}
        </div>
      </div>
      </blockquote>
    )
  }
}

export default BookCard 