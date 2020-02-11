import React, { Component } from "react";
import Chosen from './components/Authors/authorChosen'
import Pagination from './components/Pagination'

import PopUp from './components/Authors/authorPopUp'

class Authors extends Component {
  constructor(props){
    super(props);
    let obj = JSON.parse(sessionStorage.getItem('Author'))
    let l = undefined, p = undefined;
    if( obj ){
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
    this.sortName = this.sortName.bind(this);
    this.InfoPopUp = this.InfoPopUp.bind(this);
  }
  sort(arr, key, isIncrease = 1){
    return arr.sort( function (a, b) {
      if (a[key] > b[key]) return isIncrease;
      if (a[key] < b[key]) return -isIncrease;
      return 0;
    } )
  }
  sortName(event, r){
    this.setState({ authors: this.sort(this.state.authors, 'name', r) })
  }
  componentDidMount(){
   
    if( this.props.location && this.props.location.id ){
      fetch('/api/authors/PagginInfo')
      .then(response => response.json())
      .then( arr=>{
        let order = arr.data.findIndex( el=> el.id === this.props.location.id) + 1;
        this.page = Math.floor(order/this.limit) + (order%this.limit ? 0: -1);
      })
      .then( () => 
        fetch('/api/authors?limit='+this.limit+'&page='+this.page)
        .then(response => response.json())
        .then( res=>this.setState({ authors: res.data || [] }) )
      )
    } else {
      fetch('/api/authors?limit='+this.limit+'&page='+this.page)
      .then(response => response.json())
      .then( res=>this.setState({ authors: res.data || [] }) )
    }

    fetch('/api/authors/info')
    .then(response => response.json())
    .then(res=>this.setState({ authorDBSize: res.data } ))

  }
  async InfoPopUp(event){
    let target = event.target;
    let id = target.getAttribute('authot_id');

    let author={};
    let books=[];
    let top = [];

    await fetch('/api/authors/'+id)
    .then(response => response.json())
    .then( res => {author = res.data})
    
    await fetch('/api/books/books-by-author-id/'+id)
    .then(response => response.json())
    .then( res => {books = res.data})
    
    await fetch('/api/books/top-books-by-author-id?top='+5+'&id='+id)
    .then(response => response.json())
    .then( res => {top = res.data})
    
   
      this.setState({ popup: <PopUp
          author = { author }
          books = { books || []}
          top = { top || []}
          del = { ()=> this.setState({popup: ''})}
      />}) 
  }
  PaginClick(limit, page){
    sessionStorage.setItem('Author', JSON.stringify({ limit: limit, page: page}) ) 
    this.limit = limit;
    this.page = page;

    fetch('/api/authors?limit='+limit+'&page='+page)
    .then(response => response.json())
    .then( res=>this.setState({ authors : res.data || [] }) )
  }
  render(){ 
    setTimeout( () => {
      if( this.props.location && this.props.location.id ){
        let a = document.querySelector('.Authors div[authot_id="'+this.props.location.id+'"]')
        if( a ){
          a.focus();
          a.classList.add('act')
          a.onblur = function(){
            a.classList.remove('act');
          } 
        }
      }
    }, 0)
    return(
      <div className="Authors">
        <h1>Authors</h1>
        <div className='AuthorsMenu '>
          <Chosen class='inline-block'/>
          <div className='sortBox box inline-block'>
            <button onClick={()=>this.sortName(event,1)} className='btn btn-info'>A...Z</button>
            <button onClick={()=>this.sortName(event,-1)} className='btn btn-info'>Z...A</button>
          </div>
        </div>
        {this.state.popup}
        <div className='AuthorsPool Pool'>{
          this.state.authors.map( (el, ind) => 
            <div key={'author-key-'+ind} className="jumbotron jumbotron-fluid" authot_id={el.id} tabIndex="-1" onFocus={ this.Focus  }>
              <div className="container">
                <div>
                  <h1 className="display-4 inline-block"><em>{el.name}</em></h1>
                  <button onClick={this.InfoPopUp} className="btn btn-info" authot_id={el.id} >больше информации об авторе</button>
                </div>
                <hr className="my-2"></hr>
                <p className="lead">{el.description}</p>
              </div>
            </div>
          )
        }</div>
        {this.state.authorDBSize ? <Pagination 
          DBSize = {this.state.authorDBSize} 
          onClick = {this.PaginClick}
          limit = {this.limit}
          page = {this.page}
        />: ''}
      </div>
    )
  }
}

export default Authors
////добавить автора
/////если указать корректрыне данные книги , то она будет создана автоматически , если ввести корректный id книги , то автор станет ее соавтором 
// fetch('/api/authors', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//         name: 'Кирилл ',
//         description: 'предпочитает писать ужастики',
// books: [
//     { 
//       title : 'Адам 2.0 ',
//       rating: 2,
//       genre: 'Ужас',
//       description: 'было очень смешно, честно', 
//     },
//    { 
//      title : 'Смородина красная 1',
//       rating: 5,
//       genre: 'Ужас',
//      description: 'было смешно, честно', 
//     },
//  {id : 'b40456d3-dfce-4641-a8ea-c3117a92b9a8'}
// ]
//       })
// })
// .then(response => response.json())
// .then( console.log )


//////////// добавить книгу с авторами , если передать корректные данные для автора , он будет создан автоматически, 
/////////// если указать id автора , он добавится в соавторы книги 

// fetch('/api/books/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//        title : 'Камыш 1',
//        rating: 1 ,
//        genre: 'Роман',
//        description: 'Пробирает до слез',
//        authors: [
//         {name: 'Серегй ', description: 'описание Сергея'},
//          {name: 'Константин ', description: 'описание Константина'},
//          { id: '881bf9ce-1b70-41f3-91a7-823b9cfe1fef' }
//        ]
//       })
//     }).then(response => response.json())
//     .then(console.log)

///////////функция обновления книги 
// fetch('/api/books/a5ac72af-3906-4791-8c6b-a0c86d4bb12a', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//        title : 'Камыш 1.0',
//        //rating: 1 ,
//        //genre: 'Роман',
//        //description: 'Пробирает до слез',
//        authors: [
// //////// если указать просто автора, то он будет создан в базе данных и станет соавтором этой книги 
//         {name: 'Серегй 2.0', description: 'описание Сергея'},
// ///////// если не указать isDel: true, то автор станет соавтором этой книги, если указать , то автор перестанет быть соавтором этой книги
//          { id: '881bf9ce-1b70-41f3-91a7-823b9cfe1fef', isDel: true },
//          { id: 'c7daf858-5278-4f5d-aaa7-ff5b707849b0' }
//        ]
//       })
//     }).then(response => response.json())
//     .then(console.log)


///////////функция обновления автора 
// fetch('/api/authors/cdebdd16-a00a-405d-89df-f23b3272bfe4', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//        name : 'Сергей 2',
//        description: 'Измененный Виктор',
//        books: [
// ////      если заполнить правильно поля книги, то она будет создана , а автор станет ее соавтором 
//          { title : 'Камыш 7.0', rating: 1, genre: 'Роман', description: 'Пробирает до слез'},
// ///////// если не указать isDel: true, то автор станет соавтором книги, если указать , то автор перестанет быть соавтором книги
//          { id: 'b40456d3-dfce-4641-a8ea-c3117a92b9a8', isDel: true },
//          { id: '22a73a28-e71c-474a-8cc7-1e11591f248a' },
//          { id: '99a73a28-e71c-474a-8cc7-1e11591f248a' }
//        ]
//       })
//     }).then(response => response.json())
//     .then(console.log)



////удалить книгу
// fetch('/api/books/b40456d3-dfce-4641-a8ea-c3117a92b9a8', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       }
//     }).then(response => response.json())
//     .then(console.log)

////удалить автора
// fetch('/api/authors/28c11908-d0a2-4047-a159-85777d2f67ad', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       }
//     }).then(response => response.json())
//     .then(console.log)

// fetch('/api/books/authors-by-book-id/8c05349b-c52d-4292-b094-664099f0d787', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       }
//     }).then(response => response.json())
//     .then(console.log)

//     fetch('/api/books/books-by-author-id/83832a35-827a-49e9-a85a-ddce27ddb4b0', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       }
//     }).then(response => response.json())
//     .then(console.log)