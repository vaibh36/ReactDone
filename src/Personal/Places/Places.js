import React,{Component} from 'react';
import Place from './Place';

class Places extends Component{

   componentDidMount(){
       console.log('Inside mount of Places')
   }

   componentDidUpdate(){
       console.log('Inside componentdid update of Places')
   }

    render(){
        console.log('All render of Places')
        return(
            <React.Fragment>
            <Place place={this.props.place} deleteLocation= {()=> this.props.deleteLocation(this.props.place)} />
            </React.Fragment>
        )
    }

   
};

export default Places;