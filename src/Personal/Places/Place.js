import React from 'react';
import Button from '../../HtmlComponents/Button';

const place = (props) => {
    return (
        <div>
            <ul>
                <li>{props.place} <Button click={() => props.deleteLocation(props.place)} name="Deleteme" /></li>
            </ul>
        </div>
    )
};

export default place;