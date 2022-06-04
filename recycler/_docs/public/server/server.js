var express = require('express');
var path = require('path');
var fs = require('fs')
var app = express()

var getDir = require('./getDirectory')


app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

// app.use(express.static('../'));


app.get("/zhDir", (req, res) => {
    var dir = getDir.getZhDir()
    res.send(dir)
})

app.get("/enDir", (req, res) => {
    var dir = getDir.getEnDir()
    res.send(dir)
})

app.post(
    "/getMd", (req, res) => {
        console.log(req.body)
        fs.readFile(req.body.url, (err, data) => {
            res.send(data)
        })
    }
)
app.listen(8888, function () {
    console.log('success listen...8888');
});