import React, { Component } from 'react';
import Button from '../../HtmlComponents/Button'
import { InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { Link, Route } from 'react-router-dom';
import Tuitordata from '../../Container/Tuitordata';
import { withRouter } from 'react-router';
import Tuitors from '../Student/Tuitors';
import RegisterStudent from '../../Container/Students/Register';
import Logout from '../../Container/Logout';
import classes from  './Student.css';
import ItemDisplay from './ItemDisplay';

class Student extends Component {

    state = {
        result: [],
        searchForm: {
            State: {
                value: ''
            },
            City: {
                value: ''
            },
            Place: {
                value: ''
            },
            Subject: {
                value: ''
            }
        },
        serverMessage: '',
        val: 0,
        tokenstudent: '',
        loggedOut: false,
        Subjects: [],
        text:''

    }
    componentDidMount() {
      
    }

    inputChangeHandler = (event, identifier) => {

        const updatedForm = {
            ...this.state.searchForm
        }
        const updatedElement = {
            ...updatedForm[identifier]
        };

        if(event.target.value.length=== 0){
            this.setState({
                Subjects:[]
            })
        }


        updatedElement.value = event.target.value;
        updatedForm[identifier].value = updatedElement.value;

        if(identifier==='Subject'){
        //    console.log('Here to update Subject Field')
            this.setState({
                searchForm: updatedForm,
                text: updatedElement.value,
            })
        }
        else{
        //    console.log('Here to update ay other field')
            this.setState({
                searchForm: updatedForm,
            })
        }

        let token = this.props.tokenstudent
        const config = {
            headers: {
                Authorization: "Bearer " + token
            },
        }

        if (identifier === 'Subject') {
            axios.get('/api/subject/' + event.target.value, config)
                .then(res => {
                    let arr;
                    let arr2 = []
                    arr = res.data.message;
                    arr.forEach((val) => {
                    //    console.log(val.subject);
                        arr2.push(val.subject)
                    });
                //    console.log('Final array is:-', arr2);
                    this.setState({
                        Subjects: arr2
                    })
                }).catch((err) => {
                    console.log('Error is:-', err);
                })
        }

        if(identifier==='State'){
            axios.get('https://indian-cities-api-nocbegfhqg.now.sh/cities')
            .then((res)=>{
                console.log(res)
            })
        }
    }

    selectTuitor = (id) => {
        console.log('Inside selecttuitor:-', this.state.result);
        this.props.history.push('/tuitordata')
    }

    searchTuitor = (event) => {
        event.preventDefault();
        this.setState({
            serverMessage: '',
            result: []
        })
        const formData = {};
        for (let forElementIdentifier in this.state.searchForm) {
            formData[forElementIdentifier] = this.state.searchForm[forElementIdentifier].value;
        }

        const searchFields = {
            searchForm: formData
        }

        console.log('Search criteria is:-', searchFields);
        axios.get('/api/searchtuitor/' + this.state.searchForm.State.value + '/' + this.state.searchForm.City.value + '/' + this.state.searchForm.Place.value + '/' + this.state.searchForm.Subject.value)
            .then(res => {
                this.setState({
                    result: res.data.docs,
                })
            }).catch((err) => {
                console.log('Error is:-', err.response.data.message);
                this.setState({
                    serverMessage: err.response.data.message
                })
            })
    }

    clicktoFavouriteorUnfavourite = (email) => {
        //const token = localStorage.getItem('tokenstudent');
        const token= this.props.tokenstudent
        const config = {
            headers: {
                Authorization: "Bearer " + token
            },
        }
        const data = {
            tuitoremail: email
        }
        axios.post('/favouriteme', data, config)
            .then((response) => {
                axios.get('/api/searchtuitor/' + this.state.searchForm.State.value + '/' + this.state.searchForm.City.value + '/' + this.state.searchForm.Place.value + '/' + this.state.searchForm.Subject.value)
                    .then(res => {

                        this.setState({
                            result: res.data.docs,

                        })
                    }).catch((err) => {
                        console.log('Error is:-', err.response.data.message);
                        this.setState({
                            serverMessage: err.response.data.message
                        })
                    })
            }).catch((err) => {
                console.log('Error is:-', err.response.data.message);
            })
    }

    suggestionSelected=(suggestion)=>{
        console.log('Suggestion selected is:-', suggestion);
        this.setState({
            text:suggestion,
            Subjects:[]
        })
    }

    // shouldComponentUpdate(nextProps,nextState){
    //     console.log('[shoulcComponentUpdate] Students');
    //     if(this.state.searchForm!== nextState.searchForm || this.state.tokenstudent!== nextState.tokenstudent || this.state.text!==nextState.text || this.state.Subjects!==nextState.Subjects)
    //         return true
    // }

    render() {
        console.log('[Students] render:-', this.state)
        let tuitors;
        let subjects = this.state.Subjects;
        const {text} = this.state
      
        tuitors = this.state.result.map((doc, index) => {
            return (

                <Tuitors key={index}
                    clickMe={() => this.clicktoFavouriteorUnfavourite(doc.Email)}
                    firstname={doc.FirstName}
                    lastname={doc.LastName}
                    favouriteCount={doc.FavouriteCount}
                ></Tuitors>
            )
        })

        return (
            <div>
                <div class="col-sm-3">
                    <h2></h2>
                    <InputGroup style={{ margin: 10 }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">State:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl  aria-label="State" aria-describedby="inputGroup-sizing-sm"
                            type="text"  onChange={(event) => this.inputChangeHandler(event, 'State')} />
                    </InputGroup>
                    <InputGroup style={{ margin: 10 }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">City:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl  aria-label="City" aria-describedby="inputGroup-sizing-sm"
                            type="text"  onChange={(event) => this.inputChangeHandler(event, 'City')} />
                    </InputGroup>
                    <div className= {classes.AutoCompleteText}>
                        <InputGroup style={{ margin: 10 }}>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-sm">Subject:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl  aria-label="City" aria-describedby="inputGroup-sizing-sm"
                                type="text" value={text} onChange={(event) => this.inputChangeHandler(event, 'Subject')}> 
                                </FormControl>
                        </InputGroup>
                       <ItemDisplay data={subjects} click={this.suggestionSelected}  />
                    </div>
                    <InputGroup style={{ margin: 10 }}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-sm">Place:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl  aria-label="City" aria-describedby="inputGroup-sizing-sm"
                            type="text"  onChange={(event) => this.inputChangeHandler(event, 'Place')} />
                    </InputGroup>
                    <Button name="Search"  click={this.searchTuitor}>Search</Button>
                </div>
                {tuitors}
                {this.state.serverMessage}
            </div>
        )
    }
}
export default withRouter(Student);