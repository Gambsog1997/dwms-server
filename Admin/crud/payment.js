const express = require("express");
const dbSchema = require("../../Customer/RegCrud/schema");
const parser = require("body-parser");
const Payment = require("../../Customer/Payment/index");

const app = express.Router();
app.use(parser.json());

//create-payment endpoint
app.post("/payment/create-payment", (req, res) => {
  if (!req.body) {
    throw new Error("bad request");
  } else {
    const payment = new Payment(15000, "000000000001", "For the month");

    payment
      .c2b()
      .then((output_TransactionID) => {
        const {
          date_Issued,
          Cust_Id,
          domId
        } = req.body;
        // console.log(output_TransactionID)

        dbSchema.payment
          .create({
            paymentRef: output_TransactionID,
            amount: payment.amount,
            startDate: date_Issued,
            customerId: Cust_Id,
            status: "paid",
            DomesticworkerDomId: domId
          })
          .then((results) => {
            // console.log(results);
            res.status(201).json(results);
          })
          .catch((err) => {
            console.log(err);
            res.status(409).json(output_TransactionID);
          });
      })
      .catch((err) => {
        res.status(500).json({ msg: "Internal server Error" });
      });
  }
});

//
app.get("/payment/get", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    dbSchema.payment
      .findAll({
        attributes: {
          excludes: [],
        },
      })
      .then((data) => {
        console.log(data);
        res.status(200).json({ msg: data });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ msg: "Not found" });
      });
  } else {
    dbSchema.payment
      .findOne({
        where: {
          paymentRef: req.query.id,
        },
      })
      .then((data) => {
        console.log(data);
        res.status(200).json({ msg: data });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ msg: "Not found" });
      });
  }
});

module.exports = app;