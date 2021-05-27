const bodyParser = require('body-parser')
const express = require('express')
const cust_Reg = express.Router()
const dbSchema = require('./schema')

cust_Reg.use(bodyParser.json())

cust_Reg.post('/registration/customer', (req, res) => {
    //need to handle errors
    const { Cust_Id, First_name, Middle_name, Last_name, birthDate,
        Occupation, Gender, street_Id, Dom_Id } = req.body;
    dbSchema.customer.create({
        custId: Cust_Id,
        firstname: First_name,
        middlename: Middle_name,
        lastname: Last_name,
        birthdate: birthDate,
        occupation: Occupation,
        gender: Gender,
        location: street_Id,
        domId: Dom_Id
    }).then((resStatus) => {
        console.log(resStatus)
        res.status(201).json({ msg: resStatus })
    }).catch((err) => {
        console.log({ err })
        res.status(409).json({ msg: { err } })
    })

})

module.exports = cust_Reg