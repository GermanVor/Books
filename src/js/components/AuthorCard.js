import React, { Component } from "react"

class AuthorCard extends Component {
  constructor(props){
    super(props)
    this.state ={
      author: {},
      books: []
    }
  }
  componentDidMount () {
   
    fetch('/api/authors/'+this.props.location.id)
    .then(response => response.json())
    .then( res=>this.setState({ author: res.data }) )
    
    fetch('/api/books/books-by-author-id/'+this.props.location.id)
    .then(response => response.json())
    .then( res =>this.setState({books: res.data}) )
  }
    
  render(){
    let { author, books} = this.state;
    console.log( { author, books} )
    return (
      <div className="AuthorCard">
        <div className='head'>
          <h1>{author.name}</h1>
          <br></br>
          <div className='description'><p>{author.description}</p></div>
        </div>
        <br/>
        {books.map( el => {
          <p>{el.title}</p>
        }) }
      </div>
    )
  }
}

export default AuthorCard