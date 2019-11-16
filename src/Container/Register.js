import React, { Component } from 'react';
import Input from '../input';
import classes from './Register.css';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';



class Register extends Component {

    state = {
        registerForm: {
            FirstName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'First Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,

                },
                valid: false,
                touched: false
            },
            LastName: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Last Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 2,

                },
                valid: false,
                touched: false
            },

            Email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Email'
                },
                value: '',
                validation: {
                    required: false
                },
                valid: false,
                touched: false
            },
            Phonenumber: {
                elementType: 'input',
                elementConfig: {
                    type: 'number',
                    placeholder: 'Phonenumber'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 10,
                    maxLength: 10
                },
                valid: false,
                touched: false
            },

            Password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,

                },
                valid: false,
                touched: false
            },
            ConfirmPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Confirm Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,

                },
                valid: false,
                touched: false
            },
            Subject: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Subject'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,

                },
                valid: false,
                touched: false
            },
            State: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'State'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,

                },
                valid: false,
                touched: false
            },
            City: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'City'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,

                },
                valid: false,
                touched: false
            },
            Places: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Places'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,

                },
                valid: false,
                touched: false
            },

            Gender: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'Male', displayValue: 'Male' },
                        { value: 'Female', displayValue: 'Female' }
                    ]
                },
                validation: {
                    required: true
                },
                value: 'Male'

            },
            Standard: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'First', displayValue: 'First' },
                        { value: 'Second', displayValue: 'Second' },
                        { value: 'Third', displayValue: 'Third' },
                        { value: 'Fourth', displayValue: 'Fourth' },
                        { value: 'Fifth', displayValue: 'Fifth' },
                        { value: 'Sixth', displayValue: 'Sixth' },
                        { value: 'Seventh', displayValue: 'Seventh' },
                        { value: 'Eighth', displayValue: 'Eighth' },
                        { value: 'Ninth', displayValue: 'Ninth' },
                        { value: 'Tenth', displayValue: 'Tenth' },
                        { value: 'Eleventh', displayValue: 'Eleventh' },
                        { value: 'Twelveth', displayValue: 'Twelveth' },
                    ]
                },
                validation: {
                    required: true
                },
                value: 'Male'

            },


        },
        formIsValid: false,
        loading: false,
        message: '',
        loaded: false
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

    handleStandards = (event) => {
        console.log(event.target.name)
    }

    registerHandler = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        })
        const formData = {};
        for (let forElementIdentifier in this.state.registerForm) {
            formData[forElementIdentifier] = this.state.registerForm[forElementIdentifier].value;
        }

        const register = {
            registerData: formData
        }

        console.log(register);

        axios.post('/api/signup', register)
            .then((response) => {
                this.setState({ loading: false, formIsValid: false , loaded:true,message:response.data.message})
                console.log(response.data.message);
             
            }).catch((response) => {
                this.setState({ loading: false, formIsValid: false,message:response.message })
                console.log(response.error)
            })


    }

    checkPasswordEquality=(x,y)=>{

       
        let isValid = false;
        if(x.value===y.value){
             isValid = true;
        }

        return isValid;
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedregisterForm = {
            ...this.state.registerForm
        };

        const updatedFormElement = {
            ...updatedregisterForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;

        updatedregisterForm[inputIdentifier] = updatedFormElement;

        let passwordequality = false;
        passwordequality=  this.checkPasswordEquality(updatedregisterForm['Password'],updatedregisterForm['ConfirmPassword'])
      
        let formIsValid = true;
        for (let inputIdentifier in updatedregisterForm) {

            formIsValid = updatedregisterForm[inputIdentifier].valid && formIsValid && passwordequality
        }


        this.setState({
            registerForm: updatedregisterForm,
            formIsValid: formIsValid
        })
    }


    render() {

        const textmessage = this.state.message;
        console.log('text message is', textmessage)
        const formElementArray = [];

        for (let key in this.state.registerForm) {
            formElementArray.push({
                id: key,
                config: this.state.registerForm[key]
            })
        }



        let form = (
            <form width="400" onSubmit={this.registerHandler}>
                {formElementArray.map(formElement => {

                    return (

                        <Input key={formElement.id}
                            elementConfig={formElement.config.elementConfig}
                            elementType={formElement.config.elementType}
                            changed={(event) => { this.inputChangeHandler(event, formElement.id) }}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            minLengthObject={formElement.config.validation}
                            value={formElement.config.value}
                        ></Input>
                    )

                })}

                <button disabled={!this.state.formIsValid}>SignUp</button>
            </form>
        )

        if (this.state.loading) {
            form = <Spinner />
        }

        let data;

        if (!this.state.loaded) {
            data = (
                <div>
                    <div className={classes.c}>
                        {form}
                    </div>
                    <div className={classes.c} >
                     
                    </div>
                </div>
            )
        }else{
            data= textmessage
        }


        return (
            <div>

               {data}
            </div>
        )
    }

}

export default Register;