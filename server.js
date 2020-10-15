var validator = require('email-validator')
var http = require('http')
var bodyParser = require('body-parser')
const axios = require('axios').default;
const express = require('express')
const app = express()

var json = []
var errorReply = ''

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view-engine', 'ejs')
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

app.get('/', (req, res) => {
    res.render('login.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/breaches', (req, res) => {
    res.render('breaches.ejs', { values: json, errors: errorReply })
})

app.post('/login', urlencodedParser, (req, res) => {

    const email = req.body.email

    const api_url = 'https://haveibeenpwned.com/api/v3/breachedaccount/' + email + '';

    axios.get(api_url, {
        headers: {
            'hibp-api-key': '11a561d02d894b5ba7239d6d1500e73a'
        }
    })
    .then(function (response) {
        console.log(response.data);
        errorReply = ''
        var input = JSON.stringify(response.data)
        json = input.split(",")
        res.redirect('breaches')
    })
    .catch(function (error) {
        console.log(error)
        json = ""
        errorReply = 'No breaches were found.'
        res.redirect('breaches')
    });
})   

app.listen(3000)
