import React, { Component } from 'react';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import TextComponent from '../../src/Components/TextComponent'

class NewPassword extends Component {

    state = {

        resetForm: {
            Password: {
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                },
                valid: false
            },
            ChangedPassword: {
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                },
                valid: false
            }
        },
        val: false,
        token: '',
        formIsValid: false,
        message:''
    }

    checkPasswordEquality = (x, y) => {

        let isValid = false;
        console.log('Values of passwords are:-', x, y)
        if (x.value === y.value) {
            isValid = true;
        }

        return isValid;
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

    changeHandler = (event, identifier) => {

        const updatedForm = {
            ...this.state.resetForm
        };

        const updatedElement = {
            ...this.state.resetForm[identifier]
        }

        updatedElement.value = event.target.value;


        updatedForm[identifier] = updatedElement


        updatedElement.valid = this.checkValidity(updatedElement.value, updatedElement.validation);
        let passwordequality = false;
        passwordequality = this.checkPasswordEquality(updatedForm['Password'], updatedForm['ChangedPassword']);

        let formIsValid = true;
        for (let inputIdentifier in updatedForm) {

            formIsValid = updatedForm[inputIdentifier].valid && formIsValid && passwordequality
        }

        this.setState({
            resetForm: updatedForm,
            formIsValid: formIsValid
        })


    }

    resetPassword = () => {

        this.setState({
            val:true
        })
        console.log('Token captued and saved is:-', this.state.token);

        const formData = {};
        for (let forElementIdentifier in this.state.resetForm) {
            formData[forElementIdentifier] = this.state.resetForm[forElementIdentifier].value;
        }

        const reset = {
            resetdata: formData
        }


        const token = this.state.token
        const config = {
            headers: {
                Authorization: "Bearer " + token
            },
        }
        axios.post('/reset', reset, config)
            .then(res => {
                console.log('response with all the data is:-', res)
                this.setState({
                    message: res.data.message
                })
            }).catch((err) => {
                console.log('error inside')
                console.log(err);

            })


    }


    componentDidMount() {
        console.log('We are inside the mount method and are trying to set the token:-', this.props.match.url);
        const complete = this.props.match.url;
        const token = complete.substring(7, complete.length);
        console.log('Token is:-', token);
        this.setState({
            token: token
        })

    }

    render() {

        let form;

        if (!this.state.val) {
            form = (
                <div>
                    <input style={Object.assign({ margin: 10 })} type="password" onChange={(event) => this.changeHandler(event, 'Password')}></input><br></br>
                    <input style={Object.assign({ margin: 10 })} type="password" onChange={(event) => this.changeHandler(event, 'ChangedPassword')}></input><br></br>
                    <button disabled={!this.state.formIsValid} style={Object.assign({ margin: 10 })} onClick={this.resetPassword}>Submit</button>
                </div>
            )
        }else{
            form = <TextComponent>{this.state.message}</TextComponent>
        }


        return (
            <div>
                  {form}
            </div>
          
        )
    }

};

export default withRouter(NewPassword);