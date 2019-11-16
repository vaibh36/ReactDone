import React, { Component } from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import Homepage from './Homepage';
import AuthContext from '../auth-context';
import Header from '../Container/Header/Header';


const logout = () => {

    console.log('Inside logout:-',localStorage.getItem('tokenstudent'))

    if (localStorage.token !== '') {
        localStorage.removeItem('token')
    } if(localStorage.tokenstudent!=='') {
        localStorage.removeItem('tokenstudent')
    }

    return (
        <Redirect to='/' />
    )
}
export default withRouter(logout);