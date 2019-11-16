import React from 'react';
import { Button } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';

const input = (props) => {

    
    return (
        <div>
            <InputGroup style={props.styleClass}>
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroup-sizing-sm">{props.name}:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder={props.name} aria-label="Username" aria-describedby="inputGroup-sizing-sm"
                    type={props.type} onChange={(event) => props.changeHandler(event)}   />
            </InputGroup>
        </div>
    )
};

export default input;