import React, { Component } from "react";
import Chosen from './components/authorChosen'
import Pagination from './components/Pagination'

import PopUp from './components/authorPopUp'

class Authors extends Component {
  constructor(props){
    super(props);
    let obj = JSON.parse(sessionStorage.getItem('Author'))
    let l = undefined, p = undefined;
    if( obj ){
      console.log(obj)
      l = obj.limit;
      p = obj.page;
    }
    this.limit = l || 3;
    this.page = p || 0;

    this.state = {
      authors: [],
      authorDBSize: 0,
      SeachValue: '',
      popup: ''
    }
    this.PaginClick = this.PaginClick.bind(this);
    this.sortAZ = this.sortAZ.bind(this);
    this.sortZA = this.sortZA.bind(this);
    this.InfoPopUp = this.InfoPopUp.bind(this);
  }
 
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
  componentWillMount(){
    
    fetch('/api/authors?limit='+this.limit+'&page='+this.page)
    .then(response => response.json())
    .then( res=>this.setState({ authors: res.data || [] }) )

    fetch('/api/authors/info')
    .then(response => response.json())
    .then(res=>this.setState({ authorDBSize: res.data } ))

  }

  async InfoPopUp(event){
    let target = event.target;
    let id = target.getAttribute('author_id');

    let author;
    let books;
    await fetch('/api/authors/'+id)
    .then(response => response.json())
    .then( res => {author = res.data})
    
    await fetch('/api/books/books-by-author-id/'+id)
    .then(response => response.json())
    .then( res => {books = res.data})

    this.setState({ popup: <PopUp
        author = { author }
        books = { books }
        del = { ()=> this.setState({popup: ''})}
    />}) 
  }
  
  PaginClick(limit, page){
    sessionStorage.setItem('Author', JSON.stringify({ limit: limit, page: page}) ) 
    this.limit = limit;
    this.page = page;

    fetch('/api/authors?limit='+limit+'&page='+page)
    .then(response => response.json())
    .then( res=>this.setState({ authors : res.data }) )
  }

  render(){
    return (
      <div className="Authors">
        Authors
        <div className='AuthorsMenu'>
          <div className='sortBox box'>
            <button onClick={this.sortAZ} >A...Z</button>
            <button onClick={this.sortZA} >Z...A</button>
          </div>
          <Chosen />
        </div>
        {this.state.popup}
        <ul>{
          this.state.authors.map( (el, ind) => 
            <li key={'author-key-'+ind}  >
              {el.name +' '+ el.description +'  |  ' + el.id + ' '}
              <button onClick={this.InfoPopUp} author_id = {el.id} >больше информации об авторе</button>
            </li>
          )
        }</ul>
        
        {this.state.authorDBSize ? <Pagination 
          DBSize = {this.state.authorDBSize} 
          onClick = {this.PaginClick}
          limit = {this.limit}
          page = {this.page}
        />: ''}

        <br/>
      </div>
    )
  }
}

export default Authors
// добавить автора
// fetch('/api/authors', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//         name: 'Семен',
//         description: 'фцаыаф 2314',
//         books: [
//           { 
//             title : 'Омут',
//             rating: 1,
//             genre: 'Комедия',
//             description: 'Комедия ', 
//           },
//           { 
//             title : 'Омут 2',
//             rating: 2,
//             genre: 'Комедия',
//             description: 'Комедия ', 
//           }
//         ]
//       })
// })
// .then(response => response.json())
// .then( console.log )


//добавить книгу с авторами , если не передать id автора , то автор будет создан 
// fetch('bookDBSize', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//        title : 'dtyui',
//        rating: 4,
//        genre: 'Ужас',
//        description: 'Ужасный ужастик',
//        authors: [
//          {name: 'Артем3', description: 'описание артема'},
//          {name: 'Женя3', description: 'описание жени'},
//        ]
//       })
//     }).then(response => response.json())
//     .then(console.log)

// //книги автора по id автора
// fetch('bookDBSize/authors-book/asf')
//     .then(response => response.json())
//     .then( console.log )

// //авторы книги по id книги 
// fetch('bookDBSize/books-by-author-id/asg ')
//     .then(response => response.json())
//     .then( console.log )