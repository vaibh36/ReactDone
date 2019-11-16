
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
var http = require('http');
var mongoose = require('mongoose');
var db = 'mongodb://localhost/vaibhav';
var tuitorinfo = require('./models/tuitor.model');
var studentinfo = require('./models/student.model');
let subjectinfo = require('./models/subject.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');
var MongooseCache = require('mongoose-redis');
var cache = MongooseCache(mongoose, "redis://127.0.0.1:6379");
var async = require("async");
var nodemailer = require('nodemailer');
var TinyURL = require('tinyurl');


var client = redis.createClient();
client.on('connect', () => {
    console.log('Connected to redis')
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(db)
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log("Connection failed");
    });


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "Origin,X-Requested-With, Content-Type,Accept");

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")

    next();
})

const verifiyToken = (req, res, next) => {

    console.log('Validate the token');
    console.log('auth data is:-', req.headers.authorization)
    if (!req.headers.authorization) {
        console.log('1', req.headers.authorization)
        return res.status(401).send('Unauthorized request');
    }
    console.log(req.headers.authorization)
    let token = req.headers.authorization.split(' ')[1];

    if (token === 'null') {
        console.log('2')
        return res.status(401).send('Please login');

    }

    console.log('hello1')
    let payload;

    try {
        payload = jwt.verify(token, 'secret_key');

    } catch (error) {
        console.log('Seems token has expired with error:-', error);
        res.status(403).json({
            err: error,
            message: 'Token has expired , please login again'
        })
    }

    console.log('hello')
    if (!payload) {
        console.log('Someissue')
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }

    console.log('Payload is', payload);
    req.Email = payload.Email;
    next()

}




app.post('/api/signup', (req, res, next) => {

    const tuitordata = new tuitorinfo();

    console.log('Places entered is', req.body.registerData.Places);
    let places = req.body.registerData.Places;
    places = places.split(" ");
    console.log(places)


    bcrypt.hash(req.body.registerData.Password, 10)
        .then(hash => {

            tuitordata.FirstName = req.body.registerData.FirstName,
                tuitordata.LastName = req.body.registerData.LastName,
                tuitordata.Email = req.body.registerData.Email,
                tuitordata.Phonenumber = req.body.registerData.Phonenumber,
                tuitordata.Password = hash,
                tuitordata.Subject = req.body.registerData.Subject,

                tuitordata.City = req.body.registerData.City,
                tuitordata.Places = places,
                tuitordata.State = req.body.registerData.State

            tuitordata.Gender = req.body.registerData.Gender
            console.log('Data sent for the enrollment is:-', tuitordata)
            tuitordata.save()
                .then((result) => {
                    res.status(201).json({
                        message: result.FirstName + ',you have registered successfully'
                    })
                })
                .catch((err) => {
                    res.send({ message: 'Email is already enrolled, please use a different email address!' });
                    res.send(err)
                })
        })
})


app.post('/api/login', (req, res, next) => {

    console.log('Inside login')
    let fetchedtuitor;
    tuitorinfo.findOne({ Email: req.body.Email })
        .then((tuitor) => {

            if (!tuitor) {
                console.log('here')
                return res.status(401).json({
                    message: 'Email Id of the tuitor does not exist , please enroll'
                });
            }
            fetchedtuitor = tuitor
            return bcrypt.compare(req.body.Password, tuitor.Password);

        })
        .then((result) => {
            if (!result) {
                console.log("Login API throwing error:-")
                res.status(403).json({
                    err: error,
                    success: false,
                    message: 'Incorrect password'
                });

            }

            const token = jwt.sign(
                { Email: fetchedtuitor.Email, userId: fetchedtuitor._id },
                'secret_key',
                { expiresIn: '24h' }
            )

            res.status(200).json({
                message: fetchedtuitor.Email + ' is successfully logged in',
                token: token

            })

            /*   return res.json({
                   message: fetchedtuitor.Email + ' is successfully logged in',
                   token: token

               })   */


        })
        .catch((error) => {
            console.log("Login API throwing error:-")
            res.status(401).json({
                err: error,
                success: false,
                message: 'Incorrect password'
            });

        })

})


app.use('/api/posts', (req, res, next) => {

    const posts = [
        { id: '3455345', title: 'first server post', content: 'coming from the server' }
    ];
    res.status(200).json({
        message: 'sent successfully',
        posts: posts
    })

})

app.get('/api/fetchtuitor', verifiyToken, async (req, res) => {

    console.log('Inside the get request to fetch the tuitor details');
    console.log(req.Email);
    console.log('fetching data from MongoDB');
    tuitorinfo.findOne({ Email: req.Email }, (err, data) => {
        if (!data) {
            res.status(201).json({
                message: 'Data does not exist'
            })
        }
        else {
            console.log('Data sending', data);
            console.log('Subject sending', data.Subject);
            console.log('Places sending', data.Places);
            res.status(201).json({
                message: 'Data found',
                Subject: data.Subject,
                Places: data.Places,
                FCount: data.FavouriteCount,
                StudentList: data.Students,
            });
        }
    }).catch(error => {
        res.status(401).json({
            error: error
        })
    })


})

app.post('/api/places/addplaces', verifiyToken, (req, res) => {

    console.log('Trying to add places', req.body.places);
 //   let placesarray = req.body.places.split(" ");
 //   console.log("placesarray is:-",placesarray)
    const newPlaces = req.body.places;

    tuitorinfo.findOneAndUpdate({ Email: req.Email },
        { $push: { Places: newPlaces } },

        { new: true }, (err, updatedVal) => {
            if (err) {
                console.log('err', err);
            }
            else {
                console.log('Success', updatedVal);
                res.status(201).json({
                    message: 'Place has been added',
                    Places: updatedVal.Places
                })
            }
        })


})

app.post('/api/delete', verifiyToken, (req, res) => {

    console.log('Trying to delete the place', req.body.place);
    tuitorinfo.findOne({ Email: req.Email }, (err, data) => {
        if (err)
            return res.status(201).json({
                err: err,
                message: 'Request cannot be processed'
            })
        else {

            if (!data) {
                res.status(201).json({
                    message: 'Data does not exist'
                })
            }
            else {
                console.log('Data retrieved', data);
                const placesarray = data.Places;
                console.log('Array made is:', placesarray);
                placesarray.remove(req.body.place);
                console.log('Final array is:-', placesarray);
                tuitorinfo.findOneAndUpdate({ Email: req.Email }, { $set: { Places: placesarray } }, (err, document) => {

                    if (err) {

                        return res.status(201).json({
                            err: err,
                            message: 'Request cannot be processed'
                        })

                    } else {

                        if (!data) {
                            res.status(201).json({
                                message: 'Data does not exist'
                            })
                        } else {
                            console.log('Final document is,', document)
                        }

                    }

                }).then((data) => {
                    console.log('Final data is', data);
                    res.status(201).json({
                        message: 'Place has been removed',
                        Places: data.Places
                    })
                }).catch((err) => {
                    console.log('Error is', err);
                    res.status(201).json({
                        err: err,
                        message: 'Request cannot be processed'
                    })
                })

            }

        }
    })

})

app.get('/api/searchtuitor/:State/:City/:Place/:Subject', (req, res) => {

    console.log('Trying to search tuitor');
    console.log(req.params.State);


    tuitorinfo.find({ 'State': { '$regex': req.params.State, $options: 'i' }, 'City': { '$regex': req.params.City, $options: 'i' }, 'Places': { '$in': [req.params.Place] }, 'Subject': { '$in': [req.params.Subject] } }, (err, docs) => {

        if (docs.length < 1) {
            console.log('No tuitor is found')
            return res.status(401).json({
                message: 'Tuitor does not exist for the entered area and the location'
            });
        }
        if (docs) {
            console.log('Tuitor has been found', docs)
            res.status(201).json({
                docs: docs
            })
        }
    }).catch((error) => {
        console.log("Search tuitor API throwing error:-")
        res.status(401).json({
            err: error,
            success: false,
            message: 'Some internal error'
        });
    })
});

app.get('/forgot/:email', (req, res, next) => {
    console.log('Trying to reset the password for the email:-', req.params.email, req.connection.remoteAddress, req.connection.localAddress, req.connection.remotePort
        , req.connection.localPort
    );

    const remoteAddress = req.connection.remoteAddress;
    const array = remoteAddress.split(':');
    const remoteIP = array[array.length - 1];
    console.log("Final remote ip is:-", remoteIP)
    const port = req.connection.localPort;
    console.log('Real ip is:-', req.header('host'));


    const tuitordata = new tuitorinfo();
    let fetchedtuitor;
    tuitorinfo.findOne({ Email: req.params.email }, (err, tuitor) => {
        if (!tuitor) {
            console.log('Tuitor is not found');
            res.status(201).json({
                message: 'Tuitor email is not registered with us'
            })
        }
        else {
            console.log('Tuitor is:-', tuitor)
            fetchedtuitor = tuitor;
            async.waterfall([
                function (done) {
                    console.log('Inside the first function')
                    const token = jwt.sign(
                        { Email: req.params.email, userId: fetchedtuitor._id },
                        'secret_key',
                        { expiresIn: '1d' }
                    )
                    console.log('Token generated is:-', token)
                    done(err, token);
                },
                function (token, done) {
                    console.log('Inside second function')
                    tuitorinfo.findOne({ Email: req.params.email }, function (err, user) {
                        if (!user) {
                            console.log('Tuitor does not exist');
                            res.send({ message: 'Tuitor does not exist' });
                        }
                        console.log('Inside third function and tuitor is:-', user)
                        tuitorinfo.resetPasswordToken = token;
                        tuitorinfo.resetPasswordExpires = Date.now() + 3600000;
                        user.save((err) => {
                            done(err, token, user)
                        });
                    })
                },
                function (token, user, done) {
                    console.log('Inside third function finally');
                    console.log('Recipient email is:-', req.params.email, req.headers['x-forwarded-host'])
                    const recipientemail = req.params.email
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'vaibh18@gmail.com',
                            pass: '********'
                        }
                    });
                    text1 = 'http://' + req.headers['x-forwarded-host'] + '/reset/' + token;
                    let text2;
                    TinyURL.shorten(text1).then(function (res) {
                        console.log(res);
                        text2= res;
                        var mailOptions = {
                            from: 'vaibh18@gmail.com',
                            to: recipientemail,
                            subject: 'Sending Email using Node.js',
                            text: 'That was easy!\n\n' + text2
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            console.log('Trying to send email');
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Trying to send email in else')
                                console.log('Email sent: ' + info.response);
                                done(null, 'Email has finally been sent')
                            }
                        });

                    }, function (err) {
                        console.log(err)
                    });
                    console.log('Text2 is:-', text2)
                    
                   
                }
            ], (err, result) => {
                if (err) {
                    console.log('We are at the error-', err)
                } else {
                    console.log('We are at the:-', result);
                    res.status(201).json({
                        message: 'Email has been sent to your registered email address'
                    })

                }
            })
        }
    })



});

app.post('/reset', verifiyToken, (req, res) => {

    console.log('Trying to reset the password after entering the new password:-', req.body.resetdata.Password);
    console.log('Data is:-', req.Email);

    const tuitordata = new tuitorinfo();
    async.waterfall([

        function (done) {
            console.log('Trying to bcrypt the password');
            bcrypt.hash(req.body.resetdata.Password, 10)
                .then(hash => {
                    tuitorinfo.findOneAndUpdate({ Email: req.Email }, { $set: { Password: hash } }, (err, updatedDoc) => {
                        if (err) {
                            console.log('Error is:-', err)
                        } else {
                            console.log('Success', updatedDoc);
                        }
                    })
                });
            done(null, 'The Password has been updated')
        }
    ], (err, result) => {
        if (err) {
            console.log('We are at the error-', err)
        } else {
            console.log(result);
            res.status(201).json({
                message: result
            })
        }
    })

})

app.post('/student/register', (req, res) => {

    console.log('Trying to register the students:-', req.body)
    const studentdata = new studentinfo();
    bcrypt.hash(req.body.registerData.Password, 11)
        .then(hash => {

            studentdata.FirstName = req.body.registerData.Firstname,
                studentdata.LastName = req.body.registerData.Lastname,
                studentdata.Email = req.body.registerData.Email,

                studentdata.Password = hash,

                console.log('Data sent for the enrollment is:-', studentdata)
            studentdata.save()
                .then((result) => {

                    res.status(201).json({
                        message: result.FirstName + ',you have registered successfully'
                    })
                })
                .catch((err) => {
                    res.send({ message: 'Email is already enrolled, please use a different email address!' });
                    res.send(err)
                })
        })


})

app.post('/api/studentlogin', (req, res, next) => {
    console.log('Inside student login')
    let fetchedstudent;
    studentinfo.findOne({ Email: req.body.Email })
        .then((student) => {

            if (!student) {
                console.log('here')
                return res.status(401).json({
                    message: 'Email Id of the student does not exist , please enroll'
                });
            }
            fetchedstudent = student
            return bcrypt.compare(req.body.Password, student.Password);
        })
        .then((result) => {
            if (!result) {
                console.log("Login API throwing error:-")
                res.status(403).json({
                    err: error,
                    success: false,
                    message: 'Incorrect password'
                });
            }
            const token = jwt.sign(
                { Email: fetchedstudent.Email, userId: fetchedstudent._id },
                'secret_key',
                { expiresIn: '1d' }
            )
            res.status(200).json({
                message: fetchedstudent.Email + ' is successfully logged in',
                token: token
            })

            /*   return res.json({
                   message: fetchedstudent.Email + ' is successfully logged in',
                   token: token
               })   */
        })
        .catch((error) => {
            console.log("Login API throwing error:-")
            res.status(401).json({
                err: error,
                success: false,
                message: 'Incorrect password'
            });
        })
})


app.get('/alltutors', (req,res)=>{
    tuitorinfo.find({}, function(err, docs) {
        if (!err){ 
            console.log('All tutors are:-',docs);
            res.status(201).json({
                message: docs
            })
        } else {throw err;}
    });
})

app.get('/api/subject/:sub',verifiyToken, (req,res)=>{
    console.log(req.params.sub)
    var regex = new RegExp(req.params.sub, 'i');

   let result=[]
   let subjectfilter =  subjectinfo.find({Subject :regex} ,{'Subject':1});
   subjectfilter.exec((err,data)=>{
        if(!err){
             console.log('All subjects are:-',data);
            
             data.forEach((sub)=>{
                 let obj = {
                     subject: sub.Subject
                 };
                 result.push(obj)
             })


            res.status(201).json({
                message: result
            })
        }else{throw err}

   })
})

app.post('/favouriteme', verifiyToken, (req, res) => {
    console.log('Trying to favourite or unfavourite the tuitor:-', req.body.tuitoremail);
    console.log('Students email is:-', req.Email);

    studentinfo.findOne({ Email: req.Email }, (err, data) => {
        if (!data) {
            res.status(201).json({
                message: 'Data does not exist'
            })
        }
        else {
            console.log('Data sending', data);
            console.log('Tuitor part of this student is:-', data.tuitors)


            // The IF code is to unfavourite the tuitor
            if (data.tuitors.includes(req.body.tuitoremail)) {

                console.log('Tuitor is present inside the student ')
                const tuitorsaray = data.tuitors;
                tuitorsaray.remove(req.body.tuitoremail);
                studentinfo.findOneAndUpdate({ Email: req.Email }, { $set: { tuitors: tuitorsaray } }, (err, doc) => {
                    console.log('Trying to update the tuitor part of student ')
                    if (err) {
                        return res.status(201).json({
                            err: err,
                            message: 'Request cannot be processed'
                        })
                    }
                    else {
                        console.log('Document is:-', doc)
                    }
                }).then((data) => {
                    console.log('Final data of he student from above is:-', data);
                   
                    let FavouriteCountgenerated;
                    tuitorinfo.findOne({ Email: req.body.tuitoremail }, (err, doc) => {
                        console.log('Favourite count to be decreased for tuitor with data:-', doc)
                        FavouriteCountgenerated = doc.FavouriteCount - 1;
                        const studentarray = doc.Students;
                        studentarray.remove(req.Email);
                        tuitorinfo.findOneAndUpdate({ Email: req.body.tuitoremail }, { $set: {FavouriteCount:FavouriteCountgenerated,Students:studentarray} }, (err, doc) => {
                            console.log('Trying to update the FavouriteCount of the tuitor now ')
                            if (err) {
                                return res.status(201).json({
                                    err: err,
                                    message: 'Request cannot be processed'
                                })
                            }
                            else {
                                console.log('Document is:-', doc)
                            }
                        }).then((data) => {
                            console.log('Final data is', data);
                            res.status(201).json({
                                docs: data,
                                message: 'The Tuitor has been unfavourited'
                            })

                        }).catch((err) => {
                            console.log('Error is:-', err)
                        })

                    })


                })

            }
            // The ELSE code is to Favourite the Tuitor
            else {
                console.log('We need to add this tuitor to the student array and vica versa');

                var tuitoremail = req.body.tuitoremail;
                console.log('Basic fields are:-', req.Email, tuitoremail)
                studentinfo.findOneAndUpdate({ Email: req.Email }, {$addToSet: { tuitors: tuitoremail }}, (err, doc) => {
                    console.log('Trying to update the tuitor part of student ')
                    if (err) {
                        return res.status(201).json({
                            err: err,
                            message: 'Request cannot be processed'
                        })
                    }
                    else {
                        console.log('Document is:-', doc)
                    }
                }).then((data) => {
                    console.log('Final data is', data);
                    let FavouriteCount;
                    tuitorinfo.findOne({ Email: req.body.tuitoremail }, (err, doc) => {
                        console.log('Favourite count to be increacsed for tuitor with data:-', doc)
                        FavouriteCountgenerated = doc.FavouriteCount + 1;
                        console.log('Value of Favourite count now has become :-', FavouriteCountgenerated);

                        tuitorinfo.findOneAndUpdate({ Email: req.body.tuitoremail },{$set:{FavouriteCount: FavouriteCountgenerated}, $addToSet: { Students: data.Email }} , (err, doc) => {
                            console.log('Trying to update the FavouriteCount of the tuitor now ')
                            if (err) {
                                return res.status(201).json({
                                    err: err,
                                    message: 'Request cannot be processed'
                                })
                            }
                            else {
                                console.log('Document is:-', doc);
                                const studentdata = new studentinfo({
                                    Email: req.Email
                                });
                                tuitorinfo.findOne({ Email: req.body.tuitoremail }, (err,doc)=>{
                                    doc.Students.push(studentdata)
                                })
                            }
                        }).then((data) => {
                            console.log('Final data is', data);
                            res.status(201).json({
                                docs: data,
                                message: 'The Tuitor has been favourited'
                            })

                        }).catch((err) => {
                            console.log('Error is:-', err)
                        })

                    })
                        .then((result) => {
                            console.log('After fav count increase, result is:-', result)
                        })

                }).catch((err) => {
                    console.log('Error is:-', err)
                })
            }
        }
    })
})



module.exports = app;
