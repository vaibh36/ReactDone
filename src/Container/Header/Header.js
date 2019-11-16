import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import Register from '../Register';
import Login1 from '../Login1';
import Findtuitor from '../Findtuitor';
import Student from '../../Container/Student/Student';
import Logout from '../Logout';
import Tuitordata from '../Tuitordata';
import ForgotPassword from '../../Container/Forgot';
import NewPassword from '../../Container/NewPassword';
import { withRouter } from 'react-router';
import RegisterStudent from '../../Container/Students/Register';
import StudentLogin from '../../Container/Students/StudentLogin';
import Personal from '../../Personal/Personal';
import Button from '../../HtmlComponents/Button';
import classes from './Header.css'

class Header extends Component {

    
    componentDidMount(){
        console.log('[Header] componentdidmount')
    }


    shouldComponentUpdate(nextProps, nextState) {
        console.log('Inside shouldcomponentupdate of Header:-', this.props, nextProps);

        if (
            this.props.token !== nextProps.token ||
             this.props.tokenstudent !== nextProps.tokenstudent || 
             this.props.errorMessage!== nextProps.errorMessage || 
             this.props.location.pathname!== nextProps.location.pathname)
            return true;
        else
            return false;
    }

  
    render() {
        console.log('[Header] render:-', this.props);
        const style={
            margin:'20px',
        }

        let homepagelinks;

        if (!(this.props.token || this.props.tokenstudent) && (this.props.location.pathname === '/')) {
            homepagelinks =
                (
                    <div>
                        <Link style={{ marginLeft: '10px' }} to='/login'>Login</Link>
                        <Link style={{ marginLeft: '10px' }} to='/register'>Register</Link>
                        <div class="dropdown" style={{ marginLeft: 1300, marginTop: '-27px' }}>
                            <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Student Corner
                <span class="caret"></span></button>
                            <ul class="dropdown-menu" >
                                <li><Link to='/students/register'>Register</Link></li>
                                <li><Link to='/students/studentlogin'>Login</Link></li>
                            </ul>
                        </div>
                    </div>
                )
        }


        if (this.props.token || this.props.tokenstudent) {
            homepagelinks = (
                <div>
                    <Button name="Logout" dlsClassName={style} click={this.props.logout} />
                </div>
            )
        }

        let redirect = null;
        if (this.props.token) {
            console.log('Tutor token is present');
            redirect = <Redirect to='/personal' />
        }

        if (this.props.tokenstudent) {
            console.log('Student token is present');
            redirect = <Redirect to='/students' />
        }

        
        return (
            <React.Fragment>
                {homepagelinks}
                {redirect}
                <Switch>
                    <Route path='/register' exact component={Register}></Route>
                    <Route path='/login' render={() => (<Login1 errorMessage={this.props.errorMessage} clicktutorLogin={this.props.loginme}></Login1>)} />}
                <Route path='/findtuitor' component={Findtuitor}></Route>
                    {this.props.tokenstudent?<Route path='/students' exact component={() => <Student tokenstudent={ this.props.tokenstudent} />}></Route>:null}
                    <Route path='/logout' exact component={() => <Logout />}></Route>
                    <Route path='/students/:id1/:id2/:id3/:id4/:id5/:id6' exact component={Tuitordata}></Route>
                    <Route path='/forgotpassword' component={ForgotPassword}></Route>
                    <Route path='/reset/:id' component={NewPassword}></Route>
                    <Route exact path='/students/register' render={() => (<RegisterStudent />)}></Route>
                    <Route exact path='/students/studentlogin' render={(props) => (<StudentLogin clickstudentLogin={this.props.studentlogin}></StudentLogin>)}></Route>
                    <Route exact path='/personal' component={Personal}></Route>
                 
                </Switch>
            </React.Fragment>
        )
    }
};

export default withRouter(Header);