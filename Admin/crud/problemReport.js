const bodyParser = require("body-parser");
const express = require("express");
const dbSchema = require("../../Customer/RegCrud/schema");
const report = express.Router();

report.use(bodyParser.json());

report.get("/report/get", (req, res) => {
    if (Object.keys(req.query).length === 0) {
        dbSchema.report
            .findAll({
                attributes: {
                    exclude: [],
                },
            })
            .then((result) => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(404).json({ error: err });
            });
    } else {
        dbSchema.report
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

//get the count report
report.get("/report/get-count", (req, res) => {
    dbSchema.sqlize
        .query(
            "SELECT category,level,count(problemReports.level) as level_count FROM problemReports INNER JOIN customers ON problemReports.customerId = customers.id group by problemReports.category,problemReports.level"
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

report.get("/report/get-all-count", (req, res) => {
    dbSchema.sqlize
      .query(
        "SELECT count(problemReports.id) as Reports FROM problemReports"
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

//updating the table, should be put
report.post("/report/update", (req, res) => {
    if (Object.keys(req.query).length === 0) {
        res.status(400).json("Bad request");
    }

    const { category, level, report } = req.body;

    dbSchema.report
        .update(
            {
                category: category,
                level: level,
                report: report
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

//delete the report
report.post("/report/delete", (req, res) => {
    if (Object.keys(req.query).length !== 0) {
        dbSchema.report
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
module.exports = report;
