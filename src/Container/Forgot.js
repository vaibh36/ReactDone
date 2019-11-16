import React,{Component} from 'react';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import { Link, Switch, Route, withRouter } from 'react-router-dom';
import TextComponent from '../Components/TextComponent'

class Forgot extends Component {

    state={
        email:'',
        message:'',
        val:0,
        loading:0
    }

    changeHandler=(event)=>{
        console.log('Inside change handler for Forgot');
        const emailentered = event.target.value;
        
        this.setState({
            email:emailentered
        })

    }

    forgotPassword=()=>{
        const email = this.state.email;
        this.setState({
            loading:1
        })
        console.log('Trying to reset the password');

        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: "Bearer " + token
            },
        }

        axios.get('/forgot/'+email, config)
            .then(res => {
               
                console.log('response with all the data is:-',res)
                this.setState({
                  message: res.data.message,
                  val:1,
                  loading:0
                })
            }).catch((err) => {
                console.log('error inside')
                console.log(err);
                this.setState({
                    logged: false
                })
            })

    }


    render(){

        let form;
        let data;


        if(!this.state.loading){

        form=(
            <div>
                 {!this.state.val?<input style={Object.assign({margin:10})} type="text" onChange={(event) => this.changeHandler(event)}></input>:null}
                 {!this.state.val?<button style={Object.assign({margin:10})} onClick={this.forgotPassword}>Submit</button>:null}
                
                <TextComponent>{this.state.message}</TextComponent>
                 {this.state.val?<Link to='/login'>Return to Sign In</Link>:null}
            </div>
        )
         
        
            }
         
    

        if(this.state.loading){
            form=(
                <Spinner />
            )
        }

        return(
            <div>
              {form}
            </div>
        )
    }
};

export default Forgot;
