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
    fetch('/api/books/'+this.props.location.id)
    .then(response => response.json())
    .then( res=>this.setState({ book: res.data }) )
    
    fetch('/api/books/authors-by-book-id/'+this.props.location.id)
    .then(response => response.json())
    .then( res =>this.setState({authors: res.data}) )
  }
  render(){
    let { authors, book} = this.state;
    return (
      <div className="AuthorCard">
        <h2 className='display-4'><em>{book.title}</em></h2>
        <h3 className='display-5'>{book.genre}</h3>
        <br></br>
        <hr className="my-2"></hr>
        <div className='description'><p>{book.description}</p></div>
        <hr className="my-2"></hr>
        <br/>
        {authors.length===1?'Автор':'Авторы'}
        <div>
          {authors.map( el => 
            <h1>{el.name}</h1>
          )}
        </div>
      </div>
    )
  }
}

export default BookCard 