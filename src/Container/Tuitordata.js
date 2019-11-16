import React,{Component} from 'react';
import axios from 'axios';

class Tuitordata extends Component{

    componentDidMount(){
        console.log('hello',this.props.match.params);
        
    }

    favouriteMe=()=>{
        console.log('Trying to favourite me');

        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: "Bearer " + token
            },
        }
        
        const data  = {
            tuitoremail : this.props.match.params.id6
        }
        axios.post('/favouriteme', data,config)
        .then((response) => {
         console.log('Response on clicking the Favourite buttons is:-', response);
            

        }).catch((err) => {
            console.log('Error is:-', err.response.data.message);
        })

    }

    render(){

        return(
            <div>
                <p>Firstname: {this.props.match.params.id1}</p>
                <p>Lastname: {this.props.match.params.id2}</p>
                <p>Email:{this.props.match.params.id6}</p>
                <p>Phone:{this.props.match.params.id3}</p>
                <p>Gender:{this.props.match.params.id4}</p>
                <p onClick={this.favouriteMe}>Facourited by:{this.props.match.params.id5}</p>
            </div>
        )
    }
};

export default Tuitordata;