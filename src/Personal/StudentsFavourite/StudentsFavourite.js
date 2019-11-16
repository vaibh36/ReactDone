import React from 'react';

const StudentsFavourite = ({students})=>{
    console.log('Emails are:-',students)
    return(
        <React.Fragment>
        {
            students.map((studentemail,index)=>{
                return(
                    <ul key={index}>
                    <li>
                        {studentemail}
                    </li>
                    </ul>
                )
            })
        }
          
        </React.Fragment>
    )
}

export default StudentsFavourite;