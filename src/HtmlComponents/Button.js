import React from 'react';
import { Button } from 'react-bootstrap';
import matchcssfunctionclass from '../../src/Header1/GenericFunc';
const button = (props)=>{

    console.log('Props are:-', props)
    const {dlsClassName}= props;

    return(
        <Button 
        style={dlsClassName}
        onClick={()=>props.click()} 
        variant="primary">{props.name}</Button>
    )
};

export default button;