import React, { Component } from "react"

class Pagination extends Component {
  constructor(props){
    super(props);
    this.state = {
      PaginCount: [],
    }
    this.limit = this.props.limit || 5;
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
      let a = document.querySelector('.Pagination ul button.activPagin ');
      if( a ) a.classList.remove('activPagin')
      event.target.classList.add('activPagin');
    }
    
    this.props.onClick(limit, page);
    return false;
  } 
  shouldComponentUpdate(nextProps, nextState){
    return (nextProps.DBSize !== this.props.DBSize) || (this.state.PaginCount !== nextState.PaginCount)
  }
  LimitMenuOnClick(event, limit){
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
    let a = document.querySelector('.Pagination ul button[page="'+ page +'"] ');
    if( a ) a.classList.add('activPagin');

    return (
      <div className="Pagination">
        <div className='LimitMenu box'>
          <button onClick={ () => this.LimitMenuOnClick(event, 3) } className={limit===3?'activPagin': ''}>3</button>
          <button onClick={ () => this.LimitMenuOnClick(event, 5) } className={limit===5?'activPagin': ''}>5</button>
        </div>

        <ul className='hr'>{
          this.state.PaginCount.map( (el,ind) => 
            <li key={'Author-ul-li-'+ind} >
              <button page={ind} onClick={()=>this.PaginClick(event, ind)} className={page===ind?'activPagin': ''}>{ind}</button>
            </li>
          )
        }</ul>
      </div>
    )
  }
}

export default Pagination