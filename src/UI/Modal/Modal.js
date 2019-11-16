import React from 'react';
import classes from './Modal.css';
import Backdrop from '../Backdrop/Backdrop';

const modal = (props) => {
   return( 

    <div >
        <Backdrop typeDisplay1={props.typeDisplay} clickMe={props.modalClosed} />
     
        <div typeDisplay={props.typeDisplay} className={classes.Modal}>
                {props.children}
            </div>
    </div>
    )
};

export default modal;