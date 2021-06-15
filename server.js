// DEPENDENCIES ///////////////////////
const express = require('express');
const path = require('path');
const fs = require('fs');
// npm package used to create unique id
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 3001;

const dataPath = 'db.json';
const dataObj = [];

// handles data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// allows index.js and css file to be loaded - MIME-type (??) console errors without this
app.use("/static", express.static('./static/'));

// ROUTES ///////////////////////
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})

// reads db.json, parses data and returns parsed data
app.get('/api/notes', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        parsedData = JSON.parse(data);
        res.json(parsedData);
    })
});

// takes user input, addes unique id with nanoid, pushes to storage array, stringifies array and writes .json file with stringified array
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = nanoid(10);
    dataObj.push(newNote);
    stringifiedData = JSON.stringify(dataObj); 

    fs.writeFile(dataPath, stringifiedData, err => {
        // error checking
        if(err) throw err;
        console.log(`A new note has been added: ${JSON.stringify(newNote)}`)
    });   

    res.json(JSON.stringify(newNote));

});

// handles delete request - loops through dataObj (storage array) and splices out object with matching request id, then rewrites the db.json file with new array. 
app.delete('/api/notes/:id', (req, res) => {
    const reqId = req.params.id;

    for(i = 0; i < dataObj.length; i++) {
    if (dataObj[i].id === reqId) {
        dataObj.splice(i, 1);
        break;
        }
    }

    const stringDataObj = JSON.stringify(dataObj);

    fs.writeFile(dataPath, stringDataObj, err => {
        // error checking
        if(err) throw err;
        console.log(`A note with ID# ${reqId} has been deleted.`);
    });

    res.json(JSON.stringify(dataObj));
});

// LISTENER ///////////////////////
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}...`))