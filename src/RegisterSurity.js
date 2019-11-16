import React from 'react';
import Modal from '../src/UI/Modal/Modal';
import { Button } from 'react-bootstrap';

const registersurity = (props) => {

    return (
        <Modal typeDisplay={props.display} modalClosed={props.closeModal}>
            <div>
                <h1>Do you want to continue?</h1>
                <Button onClick={props.getDataRegistered} style={{margin:10}}>Yes</Button>
                <Button onClick={props.dontregister}>No</Button>
            </div>
        </Modal>

    )

};

export default registersurity