const bodyParser = require("body-parser");
const express = require("express");
const dbSchema = require("../../Customer/RegCrud/schema");
const referee = express.Router();

referee.use(bodyParser.json());

referee.get("/referee/list", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    dbSchema.referee
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
        res.status(404).json( err);
      });
  } else {
    dbSchema.referee
      .findOne({
        where: {
          id: req.query.id,
        },
      })
      .then((result) => {
        res.status(200).json({ data: result });
      })
      .catch((err) => {
        res.status(404).json({ err: "Not found" });
      });
  }
  //need to handle errors
});

//updating the table
referee.put("/referee/update", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.status(400).json("Bad request");
  }
  dbSchema.referee
    .update(
      {
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        location: req.body.location,
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
      res.status(200).json({ msg: err });
    });
});

//delete the referee
referee.post("/referee/delete", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    dbSchema.referee
      .destroy({
        where: {
          id: req.query.id,
        },
      })
      .then((result) => {
        res.status(200).json({ msg: result });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  } else {
    res.status(400).json({ msg: "Bad request" });
  }
});

module.exports = referee;