import React from 'react';
import classes from './Backdrop.css'

const backdrop= (props) =>(
   
    
 
        props.typeDisplay1 ? <div className={classes.Backdrop} onClick={props.clickMe}></div>:null
   
   
);

export default backdrop;