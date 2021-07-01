const bodyParser = require("body-parser");
const express = require("express");
const dbSchema = require("../../Customer/RegCrud/schema");
const location = express.Router();

location.use(bodyParser.json());

location.get("/location/get", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    dbSchema.location
      .query(
        "SELECT * FROM Domesticworkers,locations INNER JOIN locations ON Domesticworkers.locationId = locations.id group by Domesticworkers.locationId"
      )
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ error: err });
      });
  } else {
    dbSchema.location
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
});

//get the count location
location.get("/location/get-count", (req, res) => {
  dbSchema.sqlize
    .query(
      "SELECT locations.district,count(Domesticworkers.locationId) as district_no FROM Domesticworkers INNER JOIN locations ON Domesticworkers.locationId = locations.id group by Domesticworkers.locationId"
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

//get the all district
/*location.get("/location/get-district", (req, res) => {
  dbSchema.sqlize
    .query(
      `SELECT DISTINCT locations.district FROM locations where locations.district like '${req.query.district}%'`
    )
    .then(([results, metadata]) => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "internal server err" });
    });
});*/

//get all for registration
location.get("/location/get-all", (req, res) => {
  dbSchema.location
    .findAll({
      where: {
        ward: {
          [dbSchema.Sequelize.Op.like]: `${req.query.ward}%`,
        },
      },
    })
    .then((results) => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "internal server err" });
    });
});

//updating the table, should be put
location.post("/location/update", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.status(400).json("Bad request");
  }

  dbSchema.domWorker
    .update(
      {
        ward: req.body.ward,
        district: req.body.district,
        region: req.body.region,
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

//delete the location
location.post("/location/delete", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    dbSchema.location
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
module.exports = location;