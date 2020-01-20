import React, { Component } from "react"


class Main extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    // fetch('/api/biba')
    //   .then(response => response.json())
    //   .then( console.log, console.log );

    setTimeout( fetch('/api/author', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({name: 'ziga', description: 99})
    })
    .then(response => response.json())
    .then(console.log)
    , 0);    

  }
  render(){
    return (
      <div className="content">
        qawsedrfgbhnjj
      </div>
    )
  }
}

export default Main