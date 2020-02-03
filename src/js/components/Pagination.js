import React, { Component } from "react"

class Pagination extends Component {
  constructor(props){
    super(props);
    this.state = {
      limit: this.props.limit || 5,
      activPagin: undefined,
      PaginCount: [],
      page: this.props.page || 0,
    }
    this.PaginLenght = this.PaginLenght.bind(this)
  }
  componentDidMount(){
    this.PaginLenght()
  }
  PaginLenght(){
    let arr = [], a = Math.ceil(this.props.DBSize/this.state.limit);
    while(a--) arr.push('');
    this.setState({ PaginCount: arr });
  }

  PaginClick(event){
    let ind = arguments[1]===0 ? 0 : arguments[1] || this.state.page;
    let limit = this.state.limit;
    // существует только потому что не стал писать отдельную функцию для div.LimitMenu button
    if( event ){
      if( this.state.activPagin ) this.state.activPagin.classList.remove('activPagin');
      this.setState({ activPagin: event.target });
      event.target.classList.add('activPagin');
    }
    
    this.props.onClick(limit, ind)
  } 

  render(){
    return (
      <div className="Pagination">
        <div className='LimitMenu box'>
          <button onClick={ ()=> this.setState({limit :3}, () => {this.PaginLenght(); this.PaginClick() } ) } >3</button>
          <button onClick={ ()=> this.setState({limit :5}, () => {this.PaginLenght(); this.PaginClick() } ) } >5</button>
        </div>

        <ul className='hr'>{
          this.state.PaginCount.map( (el,ind) => 
            <li key={'Author-ul-li-'+ind}>
              <button page={ind} onClick={()=>this.PaginClick(event, ind)}>{ind}</button>
            </li>
          )
        }</ul>
      </div>
    )
  }
}

export default Pagination