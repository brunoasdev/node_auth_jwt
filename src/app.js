require('dotenv').config() //import sensitive data
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//Config JSON request
app.use(express.json())

//Models
const User = require('./models/User')

//Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ msg: "Welcome to API" })
})

//Register user
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    //Validations
    if(!name) {
        return res.status(422).json({ msg: "Name is mandatory" })
    }

    if(!email) {
        return res.status(422).json({ msg: "Email is mandatory" })
    }

    if(!password) {
        return res.status(422).json({ msg: "Password is mandatory" })
    }

    if(password != confirmpassword) {
        return res.status(422).json({ msg: "Passwords do not match" })
    }

    //Check if user exists
    const userExists = await User.findOne({ email: email })

    if(userExists) {
        return res.status(422).json({ msg: "Please use another email" })
    }

    //Create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Create user
    const user = new User({
        name,
        email,
        password,
    })

    try {

        await user.save()
        res.status(201).json({ msg: "User created successfully." })

    }catch(error) {
        console.log(error)
        res.status(500).json({ msg: "There was an error on the server. Try later" })
    }
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
