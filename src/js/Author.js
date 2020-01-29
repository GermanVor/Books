import React, { Component } from "react";
import Chosen from './components/Chosen'

class Author extends Component {
  constructor(props){
    super(props);
    this.state = {
      authors: [],
      popUpCount: [],
      limit: 5,
      page: 0,
      authorDBSize: 0,
      activPopUp: undefined,
      SeachValue: ''
    }
    this.PopUpClick = this.PopUpClick.bind(this);
    this.sortAZ = this.sortAZ.bind(this);
    this.sortZA = this.sortZA.bind(this);
  }
  /**
	 * @returns Array
	 */
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
  componentDidMount(){
    // fetch('/api/author', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json;charset=utf-8'
    //   },
    //   body: JSON.stringify({name: 'ziga', description: 99})
    // })
    // .then(response => response.json())
    // .then(console.log)
    //let setState = this.setState.bind(this);  
    let limit = this.state.limit;
    fetch('/api/author?limit='+limit+'&page=0')
    .then(response => response.json())
    .then( res=>this.setState({ authors: res.data }, this.setState({ page: 0 })) )

    fetch('/api/author/info')
    .then(response => response.json())
    .then(res=>{
      let arr = [], a = Math.ceil(res.data/limit);
      while(a--) arr.push('');
      this.setState({ popUpCount: arr });
      this.setState({ authorDBSize: res.data});
    });

  }

  PopUpClick(event){
    let ind = arguments[1]===0 ? 0 : arguments[1] || this.state.page;
    let limit = this.state.limit;
    
    // существует только потому что не стал писать отдельную функцию для div.LimitMenu button
    if( event ){
      if( this.state.activPopUp ) this.state.activPopUp.classList.remove('activPopUp');
      this.setState({ activPopUp: event.target });
      event.target.classList.add('activPopUp');
    }

    fetch('/api/author?limit='+limit+'&page='+ind)
    .then(response => response.json())
    .then( res=>this.setState({ authors : res.data }) )
    
  } 
  
  PopUpLenght(){
    let arr = [], a = Math.ceil(this.state.authorDBSize/this.state.limit);
    while(a--) arr.push('');
    this.setState({ popUpCount: arr });
  }
  
  render(){
    return (
      <div className="Author">
        Author
        <div className='AuthorMenu'>
          <div className='LimitMenu box'>
            <button onClick={ ()=> this.setState({limit :3}, () => {this.PopUpLenght(); this.PopUpClick() } ) } >3</button>
            <button onClick={ ()=> this.setState({limit :5}, () => {this.PopUpLenght(); this.PopUpClick() } ) } >5</button>
          </div>
          <div className='sortBox box'>
            <button onClick={this.sortAZ} >A...Z</button>
            <button onClick={this.sortZA} >Z...A</button>
          </div>
          
            <Chosen onChange={value => console.log(value)} ArrMenu={ (['абвгде','абв','аабв','л'].sort()) } />
           
        </div>
        <ul>{
          this.state.authors.map( (el, ind) => 
            <li key={'book-key-'+ind} author_id = {el.author_id} >
              {el.name +' '+ el.description +' '+ el.author_id}
            </li>
          )
        }</ul>
        <div className='popUp'>
          <ul className='hr'>{
            this.state.popUpCount.map( (el,ind) => 
              <li key={'Author-ul-li-'+ind}>
                <button page={ind} onClick={()=>this.PopUpClick(event, ind)}>{ind}</button>
              </li>
            )
          }</ul>
        </div>
        <br/>
      </div>
    )
  }
}

export default Author