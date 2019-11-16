import React, { Component } from 'react';

import axios from 'axios';
import { withRouter } from 'react-router';
import Modal from '../../UI/Modal/Modal';
import TextComponent from '../../Components/TextComponent';
import Input from '../../HtmlComponents/Input';
import Button from '../../HtmlComponents/Button';

class StudentLogin extends Component {

    state = {
        loginForm: {
            Email: {
                value: ''
            },
            Password: {
                value: ''
            }
        },
        tokenstudent: '',
        errorMessage: ''
    }

    componentDidMount() {
        console.log('Inside the component did mount of login')
        // this.refs.email.value = ''
        // this.refs.password.value = ''
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('Component did update of Login1 is called');
        // console.log('prevProps message is:-', prevProps.message);
        // console.log('This.props message is:-', this.props.message);
        // console.log('This.state.errormessage is:-', this.state.errorMessage)
        if (prevProps.message !== this.props.message) {
            this.setState({
                errorMessage: this.props.message
            })
        }
        else {
        //    console.log('we are in else')
        }
    }

    studentLogger = (a, b) => {
        console.log('Student trying to login:-', this.state.loginForm);
        const formData = { Email: a, Password: b };
        // for (let forElementIdentifier in this.state.loginForm) {
        //     formData[forElementIdentifier] = this.state.loginForm[forElementIdentifier].value
        // }
        axios.post('/api/studentlogin', formData)
            .then((response) => {

                localStorage.setItem('tokenstudent', response.data.token)
                this.props.history.push('/students');
                this.setState({
                    tokenstudent: response.data.token,

                }
                )


                // this.setState({
                //     tokenstudent: response.data.token
                // },()=>{
                //     this.props.history.push('/students');
                // })

            }).catch((err) => {
                console.log('Error is:-', err.response.data.message);
                this.setState({
                    errorMessage: err.response.data.message,

                })
            })

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

    render() {
    //    console.log('Inside render of student login')
        return (
            <div>
                <div class="col-sm-3">
                    <Input name="Email" type="email" changeHandler={(event) => this.onChangeHandler(event, 'Email')} styleClass={{ margin: '10px' }} />
                    <Input name="Password" type="password" changeHandler={(event) => this.onChangeHandler(event, 'Password')} styleClass={{ margin: '10px' }} />
                </div>
                <Button name="Login" styleClass={{ margin: '30px' }} click={() => this.props.clickstudentLogin(this.state.loginForm.Email.value, this.state.loginForm.Password.value)} />

                <TextComponent>{this.state.errorMessage}</TextComponent>
            </div>

        )
    }
};

export default withRouter(StudentLogin);