import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import Homepage from '../Container/Homepage';

const Header1 = () =>{

    return(
        <div style={{ lineHeight: '20%', justifyContent: 'center' }} align="center">
        <Link to='/'><h3 style={{ marginLeft: '10px', marginBottom: '0px', paddingBottom: '0px' }}>Find my tutor</h3></Link>
        <span style={{ fontSize: '10px', marginLeft: '80px', fontFamily: 'Times New Roman", Times, serif;' }}>Discover.Learn.Grow</span>
      {/*  <Route path='/' component={Homepage}></Route> */}
        </div>
    )
};

export default Header1;