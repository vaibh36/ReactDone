import React ,{useEffect} from 'react';
import  classes from './input.css'


const Input = props=>{

    const minLengthObj = {
        ...props.minLengthObject
    }
  
   

    let inputElement= null;
    const inputClasses = [classes.inputElement];;
    
    let tag ;
    if(props.touched){

        if(props.invalid && props.shouldValidate){
            inputClasses.push(classes.invalid);

            if(props.value.length< minLengthObj.minLength){
                tag = <p>Value should be more {minLengthObj.minLength}</p>
            }
        }
    }

   

    switch(props.elementType){

        case ('input') :
        inputElement =
        <div >
            <label>{props.elementConfig.placeholder}:</label>
             <input className = {classes.displayTags} {...props.elementConfig} className={inputClasses.join(' ')}
             onChange={(event)=>props.changed(event)}
             />
        {tag}
        </div>
       
            break;

           

        case ('select'):
        inputElement =   <select className={classes.select } onChange={props.changed}>
            {props.elementConfig.options.map((option)=>{

                return(

                    <option  key={option.value}>
                        {option.displayValue}
                    </option>
                )

            })}
        </select>
        break;


        default:
        inputElement = <input {...props.elementConfig}></input>

    }

    return(
        <div>
        {inputElement}
        </div>
    )

};

export default Input;