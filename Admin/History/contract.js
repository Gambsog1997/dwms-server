const express = require('express')
const dbSchema = require('../../Customer/RegCrud/schema')
const parser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

const app = express.Router()
app.use(parser.json())

//create-contract endpoint
app.post('/contract/create-contract', (req, res) => {
    if (!req.body) {
        throw new Error('bad request')
    } else {
        const { date_Issued, expiry_date, Dom_Id, Cust_Id } = req.body;

        dbSchema.contract.create({
            custId: Cust_Id,
            contractRef: uuidv4(),
            startDate: date_Issued,
            endDate: expiry_date,
            domId: Dom_Id
        }).then((results) => {
            console.log(results)
            res.status(201).json({ msg: results })
        }).catch((err) => {
            console.log(err)
            res.status(409).json({ msg: err })
        })
    }
})

//contract endpoint
app.get('/contract/get', (req, res) => {
    if (Object.keys(req.query).length === 0) {
        dbSchema.contract.findAll({
            attributes: {
                excludes: []
            },
            include: [{ model: dbSchema.customer }, { model: dbSchema.domWorker }]
        }).then((data) => {
            console.log(data)
            res.status(200).json(data)
        }).catch((err) => {
            console.log(err)
            res.status(404).json({ msg: "Not found" })
        })
    } else {
        dbSchema.contract.findOne({
            where: {
                id: req.query.id
            }
        }).then((data) => {
            console.log(data)
            res.status(200).json({ msg: data })
        }).catch((err) => {
            console.log(err)
            res.status(404).json({ msg: "Not found" })
        })
    }

})

module.exports = app