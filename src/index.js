import React from 'react'
import ReactDOM from 'react-dom'
import Toggle from './js/Toggle'
import './css/Author.css'

ReactDOM.render(
  <Toggle />,
  document.getElementById('react-container') // eslint-disable-line no-undef
)

if(module.hot) // eslint-disable-line no-undef  
  module.hot.accept() // eslint-disable-line no-undef  

