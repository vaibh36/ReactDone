import React from 'react';
import classes from './TextComponent.css'

const textcomponent = (props)=>{

    const {
        children
    } = props

    return(
        <span className={classes.boldclass}>{children}</span>
    )

};

export default textcomponent;