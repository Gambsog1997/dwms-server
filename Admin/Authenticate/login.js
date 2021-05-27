const express = require("express");
const jwt = require("jsonwebtoken");
const dbSchema = require("../../Customer/RegCrud/schema");
const customerAuthenticate = express.Router();
const meTokenSecret = "We dem boys"

customerAuthenticate.post("/customer/authentication", (req, res) => {
    dbSchema.customer.findOne({
        where: {
            email: req.body.username,
            password: req.body.password
        }
    })
        .then((results) => {
            if (results) {
                const accessToken = jwt.sign(JSON.stringify(results), meTokenSecret)
                const result = { ...results, accessToken }
                res.json(result).status(200)
                console.log('user exist');
            } else {
                res.json({ msg: "Not found" }).status(200)
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: "internal server err" });
        });
});

module.exports = customerAuthenticate
