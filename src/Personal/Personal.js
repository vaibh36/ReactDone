import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Input from '../input';
import AuthContext from '../auth-context';
import Header from '../Container/Header/Header';
import { InputGroup, FormControl } from 'react-bootstrap';
import TextComponent from '../Components/TextComponent';
import classes from './Personal.css';
import Places from './Places/Places';
import Studentfav from './StudentsFavourite/StudentsFavourite';
import { withRouter } from 'react-router';
import Button from '../HtmlComponents/Button';
import Logout from '../../src/Container/Logout';

class personal extends Component {

    state = {
        Places: [],
        Subject: '',
        logged: false,
        newPlaces: '',
        formIsValid: false,
        FavouriteCount: null,
        serverMessage: '',
        Slist: [],
        showlist: false,
        loggedOut: false,
    }

    constructor(props) {
        super(props);
        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

    }

    componentDidMount() {
        console.log('Inside component did mount of Personal')
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                Authorization: "Bearer " + token
            },
        }
        axios.get('/api/fetchtuitor', config)
            .then(res => {
                this.setState({
                    Places: res.data.Places,
                    Subject: res.data.Subject,
                    logged: true,
                    FavouriteCount: res.data.FCount,
                    Slist: res.data.StudentList,
                })
            }).catch((err) => {
                this.setState({
                    logged: false,
                    serverMessage: err.response.data.message
                })
            })
    }

    checkValidity = (value, rules) => {

        let isValid = true;
        if (rules.required) {
            isValid = value.trim() !== '' && isValid
        }
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid;
    }

    inputChangeHandler = (event) => {

        let updatedPlaces = this.state.newPlaces;
        updatedPlaces = event.target.value;
        let formIsValid;

        if (updatedPlaces.length > 2) {
            formIsValid = true;
        }

        this.setState({
            newPlaces: updatedPlaces,
            formIsValid: formIsValid
        })
    }

    addPlacesHandler = (event) => {

    //    event.preventDefault();
        console.log('Event is:-',event)
        let Placesdata = this.state.newPlaces;
        const Placcesarray = Placesdata.split(" ");
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        }
        const data = {
            places: Placcesarray
        }
        axios.post('/api/places/addplaces', data, {
            'headers': {
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            this.setState({
                Places: res.data.Places,
                value: '',
                formIsValid: false
            })
            this.refs.newplaces.value = ''
        }).catch((err) => {
            console.log('Seems some issue while added places with the error:-', err)
        })
    }

    deleteLocation = (location) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: "Bearer " + token
            },
        }
        const data = {
            place: location
        }
        axios.post('/api/delete', data, {
            'headers': {
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            this.setState({
                Places: res.data.Places
            })
        })
            .catch((err) => {
                console.log('Seems some error with the value of error as :-', err)
            })
    }

    changeShowList = () => {
        console.log('Trying to change the value and find the student list');
        this.setState({
            showlist: true
        })
    }

    showDropdownMenu() {
        this.setState({ showlist: true }, () => {
            document.addEventListener('click', this.hideDropdownMenu);
        });
    }

    hideDropdownMenu() {
        this.setState({ showlist: false }, () => {
            document.removeEventListener('click', this.hideDropdownMenu);
        });
    }

    logOut = () => {
        console.log('Inside logout');
        
        this.setState({
            loggedOut: true
        },()=>{
            this.props.history.push('/')
        })
    }

    componentDidUpdate(prevProps, prevState){
        console.log('[Personal] componentDidUpdate');
    }

    render() {
      
        let allPlaces = this.state.Places;
        let studentlist = this.state.Slist
        let form = (
            <form width="900" onSubmit={this.addPlacesHandler}>
                <div class="col-sm-3">
                    <InputGroup style={{ margin: 5 }}>
                        <FormControl
                            placeholder="Add Places"
                            aria-label="Add Places" ref="newplaces"
                            aria-describedby="basic-addon2"
                            onChange={(event) => this.inputChangeHandler(event)}
                        />
                    </InputGroup>
                    <span>Add single value without special characters eg. sec7,sec8,sec9</span>
                </div>
                <Button type="submit" style={{ margin: 30 }} disabled={!this.state.formIsValid} click={(event)=> this.addPlacesHandler(event)} name="AddPlaces" />
            </form>
        )

        let personalData;
        if (this.state.logged) {
            personalData = (
                <div>
                    <p>Myclasses and the places are mentioned below</p>
                    {
                        allPlaces.map((place, index) => {
                            return (
                                <Places key={index} place={place} deleteLocation={() => this.deleteLocation(place)}></Places>
                            )
                        })
                    }
                    <p style={{padding: '5px'}}>Subject:{this.state.Subject}</p>
                    <div className={classes.dropdown} style={Object.assign({ marginLeft: 450 })}>
                        <div className={classes.button} class="btn btn-primary dropdown-toggle" onClick={() => this.showDropdownMenu()}>favorite</div>
                        {
                            this.state.showlist
                                ? (
                                    <Studentfav students={studentlist}></Studentfav>
                                ) : null
                        }
                    </div>
                    {form}
                </div>
            )
        }
        else {
            personalData = <TextComponent>{this.state.serverMessage}</TextComponent>
        }

        return (
            <div>
                {personalData}
            </div>
        )
    }
}

export default withRouter(personal);