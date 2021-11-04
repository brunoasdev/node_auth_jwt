require('dotenv').config() //import sensitive data
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Welcome to API' })
})

//credentials
const dbUser = process.env.DB_USER
const dbPasswd = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPasswd}@cluster0.ljtwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => { 
        app.listen(3000)
        console.log("Database connected!") 
    })
    .catch((err) => console.log(err))
