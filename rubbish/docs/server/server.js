var express = require('express');
var path = require('path');
var fs = require('fs')
var app = express()

var getDirectory = require('./getDirectory')

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.static('../'));


app.get("/list", (req, res) => {
    var dir = getDirectory()
    res.send(dir)
})

app.listen(8888, function () {
    console.log('success listen...8888');
});