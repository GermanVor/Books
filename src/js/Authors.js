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
//если указать корректрыне данные книги , то она будет создана автоматически , если ввести корректный id книги , то автор станет ее соавтором 
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
//  {id : ''}
// ]
//       })
// })
// .then(response => response.json())
// .then( console.log )


// // добавить книгу с авторами , если передать корректные данные для автора , он будет создан автоматически, 
// // если указать id автора , он добавится в соавторы книги 

// fetch('/api/books/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//        title : 'Камыш 3',
//        rating: 1 ,
//        genre: 'Роман',
//        description: 'Пробирает до слез',
//        authors: [
//         {name: 'Серегй ', description: 'описание Сергея'},
//          {name: 'Константин ', description: 'описание Константина'},
//          { id: '' }
//        ]
//       })
//     }).then(response => response.json())
//     .then(console.log)

////функция обновления книги 
// fetch('/api/books/fedcddba-8fcb-4e7a-97a1-d1cdfe57e311', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8'
//       },
//       body: JSON.stringify({
//        title : 'Камыш 3.0',
//        rating: 1 ,
//        genre: 'Роман',
//        description: 'Пробирает до слез',
//        authors: [
//         {name: 'Серегй 2.0', description: 'описание Сергея'},
//          { id: '474f6a6a-04d2-4fee-9d5a-b487405b2477' },
//          { id: 'fedcddba-8fcb-4e7a-97a1-d1cdfe57e311' }
//        ]
//       })
//     }).then(response => response.json())
//     .then(console.log)