import React, { Component } from "react"

class Pagination extends Component {
  constructor(props){
    super(props);
    this.state = {
      PaginCount: [],
    }
    
    let LimitMenuArr = this.props.LimitMenuArr.sort((a,b)=>a-b);
    this.limit = LimitMenuArr.find(a=>a===this.props.limit)? this.props.limit : LimitMenuArr[0];
    this.page = this.props.page || 0;

    this.PaginLenght = this.PaginLenght.bind(this);
    this.LimitMenuOnClick = this.LimitMenuOnClick.bind(this);
  }
  componentWillMount(){
    this.PaginLenght()
  }
  PaginLenght(){
    let arr = [], a = Math.ceil(this.props.DBSize/this.limit);
    while(a--) arr.push('');
    this.setState({ PaginCount: arr });
  }
  PaginClick(event){
    let page = arguments[1]===0 ? 0 : arguments[1] || this.page;
    let limit = this.limit; 
    this.page = page;

    if( event ){
      let a = document.querySelector('.Pagination div.btn-group button.activPagin ');
      if( a ) a.classList.remove('activPagin')
      event.target.classList.add('activPagin');
    }
    this.props.onClick(limit, page);
    return false;
  } 
  shouldComponentUpdate(nextProps, nextState){
    return (nextProps.DBSize !== this.props.DBSize) || (this.state.PaginCount !== nextState.PaginCount)
  }
  LimitMenuOnClick(limit){
    if(limit === this.limit) return
    while(1){
      if(this.page*limit < this.props.DBSize) break
      else --this.page
    }
    
    this.limit = limit;
    this.props.onClick(limit, this.page);
    this.PaginLenght()
  }
  render(){
    let page = this.page; 
    let limit = this.limit;
    //потому что реакт слишком хорошо оптимизирован и может не перерисовать нужный элемент PaginCount
    let a = document.querySelector('.Pagination div.btn-group button[page="'+ page +'"] ');
    if( a ) a.classList.add('activPagin');
    return (
      <div className="Pagination">
        <div className='LimitMenu'>
          {this.props.LimitMenuArr.sort((a,b)=>a-b).map( el => 
            <button onClick={ () => this.LimitMenuOnClick(el) } key={'LimitMenu-'+el}
              className={'btn btn-info ' + (limit===el?'activPagin':'')} limit={el}>{el}
            </button>
          )}
        </div>
        <div className="btn-group mr-2" role="group" aria-label="First group">{
          this.state.PaginCount.map( (el,ind) => 
            <button key={'Author-ul-li-'+ind} type="button"
              page={ind} onClick={()=>this.PaginClick(event, ind)} 
              className={ 'btn btn-info ' + (page===ind?'activPagin': '')  }>{ind}
            </button>
          )
        }</div>
      </div>
    )
  }
}

export default Pagination