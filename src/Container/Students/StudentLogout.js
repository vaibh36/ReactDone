import React,{Component} from 'react';
import { Link, Switch, Route,Redirect } from 'react-router-dom';

class StudentLogout extends Component {

    componentWillMount(){
        localStorage.removeItem('tokenstudent')
    }

    

    render(){
        return(
            <Redirect to='/homepage' />
        )
       
    }
};

export default StudentLogout