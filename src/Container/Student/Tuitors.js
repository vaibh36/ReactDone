import React , {Component} from 'react';
import {Route} from 'react-router-dom';
import Tuitordata from '../Tuitordata'

class Tuitors extends Component{

    

    render(){
        return(
            <div>
                <ul>
                    <li>
                        <p>{this.props.firstname}  {this.props.lastname}</p>
                        <p onClick={this.props.clickMe}> Favourited by: {this.props.favouriteCount}</p>
                    </li>
                </ul>
                
            </div>
        )
    }
    
}

export default Tuitors;
