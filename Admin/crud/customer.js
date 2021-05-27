const bodyParser = require("body-parser");
const express = require("express");
const dbSchema = require("../../Customer/RegCrud/schema");
const customer = express.Router();

customer.use(bodyParser.json());

customer.get("/customer/list", (req, res) => {
  //need to handle errors
  if (Object.keys(req.query).length === 0) {
    dbSchema.customer
      .findAll({
        includes: [
          {
            model: dbSchema.location,
            as: "Places",
          },
        ],
      })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  } else {
    //need to handle errors
    dbSchema.customer
      .findOne({
        where: {
          id: req.query.id,
        },
      })
      .then((result) => {
        if (result === null) {
          res.status(404).json({ data: "Not Found" });
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  }
});

customer.get("/customer/get-count", (req, res) => {
  dbSchema.sqlize
    .query(
      "SELECT count(customers.id) as Customers FROM customers"
    )
    .then(([results, metadata]) => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "internal server err" });
    });
});

//updating the table
customer.put("/customer/update", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.status(400).json("Bad request");
  }
  const { firstname, middlename, lastname, location } = req.body;

  dbSchema.customer
    .update(
      {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        location: location,
      },
      {
        where: {
          id: req.query.id,
        },
      }
    )
    .then((data) => {
      console.log(data);
      res.status(200).json({ msg: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ msg: err });
    });
});

//delete the customer
customer.post("/customer/delete", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    dbSchema.customer
      .destroy({
        where: {
          id: req.query.id,
        },
      })
      .then((result) => {
        if (result === 0) {
          res.status(404).json({ msg: "Not found" });
        } else {
          res.status(200).json({ msg: result });
        }
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  } else {
    res.status(400).json({ msg: "Bad request" });
  }
});

module.exports = customer;
