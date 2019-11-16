import React,{Component} from 'react';
import Logout from '../src/Container/Logout';
import { Route } from 'react-router-dom';
import ForgotPassword from '../src/Container/Forgot';
import NewPassword from '../src/Container/NewPassword'

class Routing extends Component {



    render(){
        return (
            <div>
                <Route path='/logout' exact component={() => <Logout />}></Route>
                <Route path='/forgotpassword' component={ForgotPassword}></Route>
                <Route path='/reset/:id' component={NewPassword}></Route>
               
            </div>
        )
    }

   


}

export default Routing;