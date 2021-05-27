const bodyParser = require("body-parser");
const express = require("express");
const dbSchema = require("../../Customer/RegCrud/schema");
const occupation = express.Router();

occupation.use(bodyParser.json());

occupation.get("/occupation/list", (req, res) => {
  //need to handle errors
  if (Object.keys(req.query).length === 0) {
    dbSchema.occupation
      .findAll({
        attributes: {
          exclude: [],
        },
      })
      .then((result) => {
        console.log(result);
        res.status(200).json({ data: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ error: err });
      });
  }
 if(req.query.id) {
    dbSchema.occupation
      .findOne({
        where: {
          id: req.query.id,
        },
      })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(404).json({ msg: "Not found" });
      });
  }

	 if(req.query.occupation) {
    dbSchema.sqlize.query(
	`select * from occupations where occupation like '${req.query.occupation}%'`)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(404).json({ msg: "Not found" });
      });
  }

});
//updating the table, should be put
occupation.put("/occupation/update", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.status(400).json("Bad request");
  }

  const { occupation } = req.body;

  dbSchema.domWorker
    .update(
      {
        occupation,
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

//delete the occupation
occupation.post("/occupation/delete", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    dbSchema.occupation
      .destroy({
        where: {
          id: req.query.id,
        },
      })
      .then((result) => {
        console.log(result);
        res.status(200).json({ result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json(err);
      });
  } else {
    res.status(400).json({ msg: "Bad request" });
  }
});
module.exports = occupation;
