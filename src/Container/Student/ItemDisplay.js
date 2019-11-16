import React,{useEffect} from 'react';

const Itemdisplay = (props)=>{

    useEffect(()=>{
        console.log('[useEffect] ItemDisplay')
    },[props.data])    
    
    return(
        <ul>
        {
            props.data.map((chunk, index) => {
                return (
                    <li onClick={()=>props.click(chunk)} key={index}>{chunk}</li>
                )
            })
        }
        </ul>
    )

};

export default Itemdisplay;