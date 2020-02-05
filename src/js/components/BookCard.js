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
        <div className='head'>
          <h1>{book.title}</h1>
          <br></br>
          <div className='description'><p>{book.description}</p></div>
        </div>
        <br/>
        {authors.map( el => {
          <p>{el.title}</p>
        }) }
      </div>
    )
  }
}

export default BookCard 