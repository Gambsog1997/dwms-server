const bodyParser = require("body-parser");
const express = require("express");
const dbSchema = require("../../Customer/RegCrud/schema");
//const op = require('sequelize').Op
const getDomWorkers = express.Router();

getDomWorkers.use(bodyParser.json());

//EAGER LOADING NEED TO BE IMPLEMENTED
getDomWorkers.get("/domestic-workers/list", (req, res) => {
  //need to handle errors
  if (Object.keys(req.query).length === 0) {
    dbSchema.domWorker
      .findAll({
        attributes: {
          exclude: [],
        },
      })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(404).json({ error: err });
      });
  } else {
    dbSchema.domWorker
      .findOne({
        where: {
          domId: req.query.id,
        },
        //attributes:['domId'],
        include: [
          {
            model: dbSchema.location,
            as: "homeLocation",
          },
        ],
      })
      .then((result) => {
        res.status(200).json({ data: result });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ err });
      });
  }
});

//get the count dom-worker
getDomWorkers.get("/domestic-workers/get-count", (req, res) => {
  dbSchema.sqlize
    .query(
      "SELECT gender,count(gender) as count FROM Domesticworkers group by gender"
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

getDomWorkers.get("/domestic-workers/get-all-workers", (req, res) => {
  dbSchema.sqlize
    .query(
      `SELECT * FROM Domesticworkers where firstname like '${req.query.firstname}%'`
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

getDomWorkers.get("/domestic-workers/all-workers", (req, res) => {
  dbSchema.sqlize
    .query(
      "SELECT count(Domesticworkers.domId) as Househelps FROM Domesticworkers"
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
getDomWorkers.put("/domestic-workers/update", (req, res) => {
  const { firstname, middlename, lastname, location } = req.body;
  dbSchema.domWorker
    .update(
      {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        location: location,
      },
      {
        where: {
          domId: req.query.id,
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

//delete the dom worker
getDomWorkers.post("/domestic-workers/delete", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    dbSchema.domWorker.destroy({
	where:{
	domId:req.query.domId
	}
    }).then((result) => {
      res.status(200).json({ msg: result })
    }).catch((err) => {
      console.log(err);
      res.status(400).json({ error: err })
    })   
  }
});

module.exports = getDomWorkers;