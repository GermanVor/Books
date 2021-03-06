import React, { Component } from "react"

class AuthorCard extends Component {
  constructor(props){
    super(props)
    this.state ={
      author: {},
      books: []
    }
  }
  componentDidMount(){
    let id = this.props.location.id
    if( id ){
      sessionStorage.setItem('AuthorCardId', JSON.stringify({ id: id}) ) 
    } else id = JSON.parse(sessionStorage.getItem('AuthorCardId')).id

    fetch('/api/authors/'+id)
    .then(response => response.json())
    .then( res=>this.setState({ author: res.data }))
    
    fetch('/api/books/books-by-author-id/'+id)
    .then(response => response.json())
    .then( res =>this.setState({books: res.data}) )
  }
  render(){
    let { author, books} = this.state;
    
    return (
      <blockquote className="blockquote text-center">
      <div className="AuthorCard">
        <div className='head'>
          <h2 className='display-4'>{author.name}</h2>
          <br></br>
          <hr className="my-2"></hr>
          <div className='description'><p>{author.description}</p></div>
        </div>
        <br/>
        <h2>{books.length===1?'Книга':'Книги'}</h2>
        <hr className="my-2"></hr>
        <div>
          {books.map( (el,ind) => 
            <div key={'AuthorCard-key-'+ind}>
              <h2 className='inline-block'><em>{el.title+' : '}</em></h2>
              <h2 className='inline-block'>{el.genre}</h2>
              <p>{el.description}</p>
            </div>
          )}
        </div>
      </div>
      </blockquote>
    )
  }
}

export default AuthorCard