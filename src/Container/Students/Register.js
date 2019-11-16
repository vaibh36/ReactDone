import React,{Component} from 'react';
import { Button } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../Spinner/Spinner';
import RegisterSurity from '../../RegisterSurity'

class Register extends Component {

    componentDidMount(){
        console.log('Inside student register function')
    }

    state={
        registerForm:{
            Firstname:{
                value:'',
               Validation:{
                   required:true
               },
               valid:false
            },
            Lastname:{
                value:'',
               Validation:{
                   required:true
               },
               valid:false
            },
            Email:{
                value:'',
                Validation:{
                    required:true
                },
                valid:false
            },
            Password:{
                value:'',
                Validation:{
                    required:true
                },
                valid:false
            },
           
        },
        formIsValid:false,
        loading:false,
        message:'',
        loaded:false,
        surity:false
    }

    checkValidity = (value, rule)=>{

        let isValid = true;
        if (rule.required) {
            isValid = value.trim() !== '' && isValid
        }
        return isValid
    }

    changeHandler=(event,inputIdentifier)=>{
        const updatedForm={
            ...this.state.registerForm
        }
        const updatedElement = {
            ...this.state.registerForm[inputIdentifier]
        }
        updatedElement.value = event.target.value;
        updatedElement.valid = this.checkValidity( updatedElement.value,updatedElement.Validation)

        updatedForm[inputIdentifier] = updatedElement;
        let formIsValid = true
        for (let inputIdentifier in updatedForm) {
            formIsValid = updatedForm[inputIdentifier].valid && formIsValid
        }
        
        this.setState({
            registerForm: updatedForm,
            formIsValid:formIsValid
        })

    }

    surityAssessment = ()=>{
        console.log('Inside surity')
        this.setState({
            surity:true,
            loaded:true,
            loading:false
        })
    }


    donotregister=(identifier)=>{

      
        console.log('Clicked no')
        this.setState({
            loaded:false,
            surity:false,
            loading:false,
      
        })
    }


    addStudent=(event)=>{
        event.preventDefault();
        this.setState({
            loading:true
        })
        const formData = {};
        for (let forElementIdentifier in this.state.registerForm) {
            formData[forElementIdentifier] = this.state.registerForm[forElementIdentifier].value
        }

        const registerstudent = {
            registerData: formData
        }

        console.log('Form fields entered are:-', registerstudent);

        axios.post('/student/register', registerstudent)
        .then((response) => {
          
            console.log(response.data.message);
            this.setState({
                message:response.data.message,
                loading:false,
                loaded:true,
                surity:false
            })
         
        }).catch((response) => {
           
            console.log(response.error)
        })

    }

    closeM=()=>{
        console.log('Trying to close the Modal');

        this.setState({
            surity:false
        })

    }
    render(){
      
        let form;
        let servermessage = this.state.message

        if(this.state.surity && this.state.loaded && !this.state.loading){
            form=
              
                <RegisterSurity display={this.state.surity}
                dontregister={this.donotregister}
                getDataRegistered={this.addStudent}
                closeModal={this.closeM}
                />
        }


        if(!this.state.loaded){
            form=(
                <div class="col-sm-3">
                
                <InputGroup style={{ margin: 10 }}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-sm">Firstname:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder="Firstname" aria-label="Username" aria-describedby="inputGroup-sizing-sm"
                        type="text" value={this.state.registerForm.Firstname.value} onChange={(event) => this.changeHandler(event, 'Firstname')} ref="firstname" />
                </InputGroup>
                <InputGroup style={{ margin: 10 }}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-sm">Lastname:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder="Lastname" aria-label="Username" aria-describedby="inputGroup-sizing-sm"
                        type="text" value={this.state.registerForm.Lastname.value} onChange={(event) => this.changeHandler(event, 'Lastname')} ref="lastname" />
                </InputGroup>
                <InputGroup style={{ margin: 10 }}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-sm">Email:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl placeholder="Email" aria-label="Username" aria-describedby="inputGroup-sizing-sm"
                        type="email" value={this.state.registerForm.Email.value} onChange={(event) => this.changeHandler(event, 'Email')} ref="email" />
                </InputGroup>
                <InputGroup style={{ margin: 10 }}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-sm">Password:</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl type="password" placeholder="Password" aria-label="Password" aria-describedby="inputGroup-sizing-sm"
                        type="password" value={this.state.registerForm.Password.value} onChange={(event) => this.changeHandler(event, 'Password')} ref="password" />
                </InputGroup>
                <Button  disabled={!this.state.formIsValid} style={{ margin: 30 }} onClick={this.surityAssessment} variant="primary">Register</Button>
        </div>
        
            ) }
            if(this.state.loaded  && !this.state.surity){
                form = servermessage
            }
            if(this.state.loading){
                form = <Spinner />
            }
        

        return(
            <div>
                {form}
            </div>
           
        )
    }


};

export default withRouter(Register);
