import React, { Component } from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import Register from './Register';
import classes from './Homepage.css';
import Login from './Login';
import Personal from '../Personal/Personal';
import Logout from '../Container/Logout';
//import Header from '../Container/Header/Header';
import AuthContext from '../auth-context';
import Findtuitor from '../../src/Container/Findtuitor';
import { withRouter } from 'react-router';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import Student from './Student/Student';
import Tuitordata from '../Container/Tuitordata';
import ForgotPassword from '../Container/Forgot'
import NewPassword from './NewPassword';
import RegisterStudent from '../Container/Students/Register';
import StudentLogin from '../Container/Students/StudentLogin';
import TuitorSearch from '../Container/Student/TuitorSearch';
import StudentLogout from '../Container/Students/StudentLogout';
import LoadSpinner from '../Components/LoadSpinner';
import Login1 from './Login1';
import Radium, { StyleRoot } from 'radium';
import Header1 from '../../src/Header1/Header1';
import Header from '../Container/Header/Header';

class Homepage extends Component {

    state = {
        token: '',
        val: false,
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
        tutorLogged: false,
        loading: false,
        formIsValid: false,
        studentsection: false,
        errorMessage: '',
        tokenstudent: '',
        StudentloginForm: {
            Email: {
                value: ''
            },
            Password: {
                value: ''
            }
        },
        studentLoading: false
    }


    componentWillMount() {

        const token = localStorage.getItem('token');
        const tokenstudent = localStorage.getItem('tokenstudent')

        if (token || tokenstudent) {
            console.log('Token is available')
            this.setState({
                token: token,
                val: true,
                tokenstudent: tokenstudent,
            })
        }
        else {
            console.log('Token is unavilable')
            this.setState({
                val: false
            })
        }

    }

    tuitorFinder = () => {

        if (!this.state.val) {
            this.props.history.push('/findtuitor')
        }
    }

    login = (a, b) => {
        console.log('Inside login of homepage:-', a, b);
        this.setState({
            loading: true
        })
        console.log('Inside login of homepage second statement:-', a, b);
        const formData = { Email: a, Password: b };

        axios.post('/api/login', formData)
            .then((response) => {
                localStorage.setItem('token', response.data.token)
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

    checkValidity = (value, rules) => {

        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;


    }

    changedValue = (event, inputIdentifier) => {

        const updatedLoginForm = {
            ...this.state.loginForm
        };
        const updatedFormElement = {
            ...this.state.loginForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        let isValid = false;
        console.log('Value now:-', updatedFormElement.value.length);
        console.log('Value of element', this.state.loginForm[inputIdentifier], ' is:-', this.state.loginForm[inputIdentifier].validation.minLength)
        if (updatedFormElement.value.length < this.state.loginForm[inputIdentifier].validation.minLength) {
            isValid = false;
            updatedFormElement.valid = false
        } else {
            isValid = true;
            updatedFormElement.valid = true
        }

        let formIsValid = true;
        for (let inputIdentifier in updatedLoginForm) {
            formIsValid = updatedFormElement[inputIdentifier].valid && formIsValid
        }


        updatedLoginForm[inputIdentifier] = updatedFormElement;
        console.log(updatedFormElement)
        this.setState({
            loginForm: updatedLoginForm,
            formIsValid: formIsValid
        })

    }

  
    onChangeHandlerStudentHandler = (event, identifier) => {

        const updatedForm = {
            ...this.state.StudentloginForm
        }
        const updatedElement = {
            ...updatedForm[identifier]
        }
        updatedElement.value = event.target.value;

        updatedForm[identifier].value = updatedElement.value;
        this.setState({
            StudentloginForm: updatedForm,
        })
    }

    logout = () => {

        console.log('Insisde the tuitor logout')
        localStorage.removeItem('token');
        localStorage.removeItem('tokenstudent')
        this.props.history.push('/')
        this.setState({
            token:'',
            tokenstudent:''
        })

    }

    studentLogOut = () => {

        const updatedStudentForm = {
            ...this.state.StudentloginForm
        }

        updatedStudentForm['Email'].value = '';
        updatedStudentForm['Password'].value = '';

        localStorage.removeItem('tokenstudent');
        this.setState(
            {
                tokenstudent: '',
                StudentloginForm: updatedStudentForm
            }
            , () => {

                this.props.history.push('/')
            })
    }


    loginStudent = () => {

        this.setState({
            studentLoading: true
        })

        const formData = {};
        for (let forElementIdentifier in this.state.StudentloginForm) {
            formData[forElementIdentifier] = this.state.StudentloginForm[forElementIdentifier].value
        }


        axios.post('/api/studentlogin', formData)
            .then((response) => {
                localStorage.setItem('tokenstudent', response.data.token)
                this.props.history.push('/students');
                this.setState({
                    tokenstudent: response.data.token,
                    studentLoading: false,
                }
                )

            }).catch((err) => {
                console.log('Error is:-', err.response.data.message);
                this.setState((state) => ({
                    errorMessage: err.response.data.message,
                    studentLoading: false
                }))

            })

        const updatedStudentForm = {
            ...this.state.StudentloginForm
        }

        updatedStudentForm['Email'].value = ''
        updatedStudentForm['Password'].value = ''

        this.setState({
            StudentloginForm: updatedStudentForm,
            errorMessage: ''
        })
    }

    studentLogger = (a, b) => {
        console.log('Student trying to login:-', this.state.loginForm);
        const formData = { Email: a, Password: b };
     
        axios.post('/api/studentlogin', formData)
            .then((response) => {

                localStorage.setItem('tokenstudent', response.data.token)
                this.props.history.push('/students');
                this.setState({
                    tokenstudent: response.data.token,
                }
            )
        
            }).catch((err) => {
                console.log('Error is:-', err.response.data.message);
                this.setState({
                    errorMessage: err.response.data.message,

                })
            })

    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('[Homepage] shouldcomponentupdate:-', this.props, nextProps, this.state.errorMessage, nextState.errorMessage);
        if (this.state.loading !== nextState.loading || this.state.token !== nextState.token || this.props.location.pathname!== nextProps.location.pathname || this.state.tokenstudent!== nextState.tokenstudent || this.state.errorMessage!== nextState.errorMessage)
            return true
        else
            return false
    }

    componentDidUpdate(prevState){
        console.log('[Homepage] componentDidUpdate');
        if(this.state.errorMessage=== prevState.errorMessage){
            this.setState({
                errorMessage:''
            })
        }
    }

    render() {
        console.log('[Homepage] render:-', this.state);
	console.log('Vaibhav Gera');
        let links;
        if (localStorage.getItem('token') && this.props.location.pathname !== '/personal') {
            links = (
                <div>
                    <Link to='/logout' onClick={this.logout}>Logout</Link>
                    <Personal />
                </div>
            )
        }

        let loader;
        if (this.state.loading || this.state.studentLoading) {
            loader = <Spinner />
        }

        return (
            <div>
                {loader}
                {!(this.state.token || this.state.tokenstudent) ? <Header1 /> : null}
                <br />
                <Header
                 token={this.state.token}
                 tokenstudent={this.state.tokenstudent}
                 loginme={this.login}
                 studentlogin={this.studentLogger}
                 logout={this.logout}
                 errorMessage={this.state.errorMessage}
                 />
            </div>
        )
    }
}

export default Radium(withRouter(Homepage));