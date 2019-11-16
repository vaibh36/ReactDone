import React, { Component } from 'react';
import Input from '../HtmlComponents/Input';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import Personal from '../Personal/Personal';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import TextComponent from '../Components/TextComponent';
import Radium from 'radium';
import Button from '../HtmlComponents/Button';

class Login1 extends Component{

    state={
        loginForm: {
            Email: {
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                },
                valid: false
            },
            Password: {
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                },
                valid: false
            }
        },
        errorMessage:'',
        loading:false,
    }

    componentDidMount(prevProps){
        console.log('Component did mount of Login1 is called:-', this.props);
    }

    login = (a, b) => {
        this.setState({
            loading: true
        })
        const formData = { Email: a, Password: b };
        axios.post('/api/login', formData)
            .then((response) => {
                localStorage.setItem('token', response.data.token)
                this.props.history.push('/personal');
                this.setState({
                    token: response.data.token, loading: false
                })  

            }).catch((err) => {
                console.log('Error is:-', err.response.data.message);
                this.setState({
                    errorMessage: err.response.data.message,
                    loading: false
                }, () => {
                    console.log('Tuitor login state in catch is:-', this.state.errorMessage)
                })
            })
    } 

    shouldComponentUpdate(nextProps, nextState){
        console.log('[Login] shouldcomponentupdate:-', this.props.errorMessage, nextProps.errorMessage);
        if(this.props.errorMessage!== nextProps.errorMessage)
            return true;
        else
            return false;
        
    }

    componentDidUpdate(prevProps,prevState){
        // console.log('Component did update of Login1 is called');
        // console.log('prevProps message is:-', prevProps.message);
        // console.log('This.props message is:-', this.props.message);
        // console.log('This.state.errormessage is:-', this.state.errorMessage)
        console.log('[Login] componentDidUpdate')
        if(prevProps.errorMessage !== this.props.errorMessage){
            this.setState({
                errorMessage: this.props.errorMessage
            })
        }
        else{
         //   console.log('we are in else')
        }
    }

    onChangeHandler = (event, identifier) => {
        const updatedForm = {
            ...this.state.loginForm
        }
        const updatedElement = {
            ...updatedForm[identifier]
        }
        updatedElement.value = event.target.value;
        updatedForm[identifier].value = updatedElement.value;
        this.setState({
            loginForm: updatedForm,

        })
    }


    render(){
     //   console.log('[Login] render')
        let loadSpinner;
        if(this.state.loading){
            loadSpinner= <Spinner />
        }

        return(
            <React.Fragment>
                {loadSpinner}
                 <div class="col-sm-3">
                <Input name="Email" type="email" changeHandler={(event)=> this.onChangeHandler(event,'Email')} styleClass={{margin:'10px'}} />
                <Input name="Password" type="password" changeHandler={(event)=> this.onChangeHandler(event,'Password')} styleClass={{margin:'10px'}} />
                </div>
                <Link to='/forgotpassword' style={{margin:'20px'}}><small>Forgot Password</small></Link>
                <Button name="Login" styleClass={{margin:'30px'}} click={()=>this.props.clicktutorLogin(this.state.loginForm.Email.value,this.state.loginForm.Password.value)}       />
                <TextComponent>{this.props.errorMessage}</TextComponent>
            </React.Fragment>
        )
    }
};

export default withRouter(Login1);