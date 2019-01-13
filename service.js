const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var MongoClient = require("mongodb").MongoClient;
var mongo = require('mongoose');



MongoClient.connect("mongodb://admin:admin1234@ds143892.mlab.com:43892/crud_simple",{ useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crud_simple') // whatever your database name is
    app.listen(8080, () =>{
        console.log('listen port 8080');
    });
});

var Schema = mongo.Schema;

var UsersSchema = new Schema({
    name : {type: String},
    address: {type: String}
}, {versionKey: false});

var model = mongo.model('crud_angular', UsersSchema);


app.use((req,res,next) => {
        res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
        res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials',true);
        next();
    }
)
app.use(
    bodyParser.urlencoded({extended: true})
);
app.use(bodyParser.json());

app.post('/api/SaveUser',(req,res) =>{
    db.collection('crud_angular').save(req.body, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.status(200).send(result);
        }
        console.log('saved to database',result);
    })
});

app.post('/api/UpdateUser',(req,res) =>{
    console.log('update to database',req.body);
    db.collection('crud_angular').save(req.body, 
    {name: req.body.name, address: req.body.address},
        (err, result) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('update to database',result);
            res.status(200).send(result);
        }
        
    })
});

app.post('/api/deleteUser',(req,res) =>{
    db.collection('crud_angular').findOneAndDelete({id: req.body._id},
        (err, result) => {
        if (err) {
            return console.log(err);
        } else {
            res.send(result);
            console.log('delete to database',result);
        }
        
    })
});

app.get('/api/getUser', (req, res) => {
    db.collection('crud_angular').find().toArray((err,result) => {
        if (err) {
            return console.log(err)
        } else {
            res.status(200).send(result);
        }  
    });
})
