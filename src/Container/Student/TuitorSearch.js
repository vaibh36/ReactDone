import React,{Component} from 'react';
import { Link, Switch, Route } from 'react-router-dom';

const TuitorSearch =()=> {

        return(
            <div>
                 <Link style={{margin:10}} to='/students/register'>StudentRegister</Link>
                <Link to='/students/studentlogin'>StudentLogin</Link>
            </div>
        )
    
};

export default TuitorSearch;