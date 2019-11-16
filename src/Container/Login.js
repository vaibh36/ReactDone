import React, { Component } from 'react';
import Input from '../input';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import Personal from '../Personal/Personal';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';
import Header from '../Container/Header/Header';
import TextComponent from '../Components/TextComponent'

class Login extends Component {

    constructor(props){
        super(props)
    }

    state = {
        isValid: false,
        Emailminlength: '',
        Passwordminlength: '',
        errorMessage: ''
    }
    componentWillMount() {
        this.setState({
            Emailminlength: this.props.emailminval,
            Passwordminlength: this.props.passwordminval,

        })
    }
    componentDidMount() {
        console.log('Inside the component did mount of login')
        this.refs.email.value = ''
        this.refs.password.value = ''
    }

    /*   static getDerivedStateFromProps(nextProps, prevState) {
           console.log('props are:-', nextProps.message);
           console.log('error message state is:-', this.props.message)
           if(this.props.message!== nextProps.message){
               return{
                   errorMessage: nextProps.message
               }
           }
           return null;
       } */

 /*   shouldComponentUpdate(nextProps, nextState) {
        console.log('Inside should component update of login this.props is:-', this.props.message);
        console.log('Inside should component update of login next props are:-', nextProps.message)
        if (this.props.message !== nextProps.message) {
            console.log('Inside the if')
            console.log('this.props is:-', this.props.message);
            console.log('next props are:-', nextProps.message)
            return false
        }
        else{
            console.log('Inside the else of shouldcomponent update of login this.props is:-', this.props.message);
            console.log('Inside the else of shouldcomponent update of login next props are:-', nextProps.message)
            return true
        }
    }  */

    refreshData = () => {
        this.setState({
            errorMessage: this.props.message
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.message !== this.props.message && this.state.errorMessage === '') {
            this.refreshData();
        }
        else {
        }
    }

    render() {
        return ( 
            <div>
                <div class="col-sm-3">
                    <InputGroup style={{ margin: 10 }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">Email:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder="Username" aria-label="Username" aria-describedby="inputGroup-sizing-sm"
                            type="email" value={this.props.email} onChange={(event) => this.props.emailVal(event, 'Email')} ref="email" />
                    </InputGroup>
                    <InputGroup style={{ margin: 10 }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">Password:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl type="password" placeholder="Password" aria-label="Password" aria-describedby="inputGroup-sizing-sm"
                            type="password" value={this.props.password} onChange={(event) => this.props.passwordVal(event, 'Password')} ref="password" />
                    </InputGroup>
                </div>
                <Link to='/forgotpassword'><small>Forgot Password</small></Link>
                <Button style={{ margin: 30 }} onClick={this.props.clickLogin} variant="primary">Login</Button>
                <TextComponent>{this.props.message}</TextComponent>
            </div>
        )
    }
}

export default withRouter(Login);