const express = require("express");
const dotenv = require('dotenv')
const cookie = require('cookie-parser')
const jwt = require("jsonwebtoken");
const dbSchema = require("../../Customer/RegCrud/schema");
const config = require("../../../dashboard-master/src/config");
const customerAuthenticate = express.Router();

var count = 0
dotenv.config()
customerAuthenticate.use(cookie())

customerAuthenticate.post("/customer/authentication", (req, res) => {
    dbSchema.customer.findOne({
        where: {
            email: req.body.username,
            password: req.body.password
        }
    })
        .then((results) => {
            if (results) {
                count = count + 1
                const accessToken = jwt.sign(JSON.stringify(results), config.token)
                const result = { ...results, accessToken }
                res.json(result).status(200)
                console.log(result);
            } else {
                res.json({ msg: "Not found" }).status(200)
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = customerAuthenticate
