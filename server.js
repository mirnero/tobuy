const express = require('express');
const path = require('path');
//const cors = require("cors");
const app = express(),
bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://admin-mirko:2H8hq01irJUNfx3Y@cluster0.jeshu.mongodb.net/blogDB?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });

/*
const allowedOrigins = ["http://localhost:3000","http://localhost:3080"];

    app.use(
        cors({
            origin: function(origin, callback) {
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    var msg =
                        "The CORS policy for this site does not " +
                        "allow access from the specified Origin.";
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            }
        })
    ); 
*/

var cose = ["uno","due","tre"];

app.use(bodyParser.json());
//app.use(express.static(process.cwd()+"/tobuy/dist/angular-nodejs-example/"));
app.use(express.static(path.join(__dirname, '/out')));

const cosaSchema = new mongoose.Schema({
    dacomprare:{
        type: Boolean
    },
    name: {
        type: String,
        required: [true, "Non vuoi nulla?"]
    },
    date: {
        type: String
    }
});

const Cosa = mongoose.model('Cosa', cosaSchema);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/out/index.html'));
  });

app.get('/api/cose', (req,res) => {
    console.log('api/cose called!')
    Cosa.find({dacomprare: true},function(err,cosedaComprare){
    let listaCose = cosedaComprare.map(function(item) {
        return item.name;
    })
        res.json(listaCose);
    })   
});

app.post('/api/cosa', (req,res) => {
    const cosa = req.body.cosa;
    console.log('Aggiungendo:::::',cosa);
    const newCosa = new Cosa({
        dacomprare: true,
        name: cosa,
        date: new Date()
    });
    
    newCosa.save(function (err) {
        if (err) { return "Non sono riuscito ad aggiungere la tua cosa!";
    } else {
        res.json(cosa);
    }}
    );

    

});

app.post('/api/del/cosa', (req,res) => {
    const cosa =req.body.cosa;
    console.log('Eliminando:::::',cosa);

    const cosaComprata = new Cosa({
        dacomprare: true,
        name: cosa,
    });

    Cosa.deleteOne({name: cosa}).then(function () {
        console.log(cosa + "eliminata");
        res.json(cosa); 
    }).catch(function(err) {
        console.log(cosa + "NON eliminata");
    });
         
    }
    );
  
  const PORT = process.env.PORT || 3080;
  app.listen(PORT, function() {
      console.log(`Our app is running on port ${ PORT }`);
  });