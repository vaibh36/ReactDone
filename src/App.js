import React from 'react';
import logo from './logo.svg';
import classes from './App.css';
import Register from './Container/Register';
import Homepage from './Container/Homepage';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from '../src/Container/Header/Header';

function App() {

  let token= false;
  token= (localStorage.getItem('token') || localStorage.getItem('tokenstudent'))?true:false;

  if(localStorage.getItem('token') || localStorage.getItem('tokenstudent')){
    token=true
  }else{
    token=false
  }


  console.log('Token value at start is:-', token)
  return (
    <div>
      <BrowserRouter>
        <Homepage />
      </BrowserRouter>
    </div>
  );
}

export default App;
