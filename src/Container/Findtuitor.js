import React, { Component } from 'react';
import Input from '../input';
import Spinner from '../Spinner/Spinner';

class Findtuitor extends Component {

    state = {
        Findtuitorform: {
            Subject: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Subject'
                },
                value: '',
                validation: {
                    required: false,
                    minLength: 3
                },
                valid: false,
                touched: false
            },
            Area: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Areas separated by space'
                },
                value: '',
                validation: {
                    required: false,
                    minLength: 3
                },
                valid: false,
                touched: false
            },

        },
        formIsValid: false,
        loading:false,
    }

    checkValidity = (value, rules) => {

        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        return isValid

    }

    inputChangeHandler = (event, inputIdentifier) => {

        const updatedForm = {
            ...this.state.Findtuitorform
        }

        const updatedFormElement = {
            ...this.state.Findtuitorform[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedForm[inputIdentifier] = updatedFormElement;

        let formIsValid= true;

        for(let inputIdentifier in updatedForm){
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid
        }


        this.setState({
            Findtuitorform:updatedForm,
            formIsValid:formIsValid
        })



    }

    render() {
        const formElementArray = [];

        for (let key in this.state.Findtuitorform) {
            formElementArray.push({
                id: key,
                config: this.state.Findtuitorform[key]
            })
        }


        let form = (
            <form width="400" onSubmit={this.loginHandler}>
                {formElementArray.map((formElement) => {

                    return (
                        <Input key={formElement.id}
                            elementConfig={formElement.config.elementConfig}
                            elementType={formElement.config.elementType}
                            value={formElement.config.value}
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangeHandler(event, formElement.id)}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                        ></Input>
                    )

                })}
                <button disabled={!this.state.formIsValid}>FindTuitor</button>
            </form>

        )
        if(this.state.loading){
            form = <Spinner />
        }

        return (
            <div>
                {form}
            </div>
        )

    }

};

export default Findtuitor

