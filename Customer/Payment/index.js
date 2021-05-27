const constants = require("constants");
const crypto = require("crypto");
const dataSample = require("./inputs");
const axios = require("axios");
const config = require("./config");
const { get } = require("http");

class Payment {
  constructor(amount, custISDN, description) {
    this.amount = amount;
    this.custISDN = custISDN;
    this.description = description;
  }

  encryptKey(key) {
    const pk =
      "-----BEGIN PUBLIC KEY-----\n" +
      config.keys.publicKey +
      "\n" +
      "-----END PUBLIC KEY-----";
    return crypto
      .publicEncrypt(
        { key: pk, padding: constants.RSA_PKCS1_PADDING },
        Buffer.from(key)
      )
      .toString("base64");
  }

  async getSessionId(apiKey) {
    try {
      const response = await axios({
        method: "get",
        url: config.urls.sessionIdUrl,
        headers: {
          Accept: "application/json",
          Origin: "*",
          Authorization: "Bearer " + this.encryptKey(apiKey),
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  c2b() {
    return this.getSessionId(config.keys.apiKey)
      .then(async (data) => {
        //console.log(data);
        try {
          const response = await axios({
            method: "post",
            url: config.urls.c2bPath,
            headers: {
              Accept: "application/json",
              Origin: "*",
              Authorization: "Bearer " + this.encryptKey(data.output_SessionID),
            },
            data: new dataSample.c2bSample(
              this.amount,
              this.custISDN,
              "M19898Z",
              "1e9b674j1dug8af09498a896cxgfxf5",
              this.description
            ).c2bDataSample(),
          });
          console.log(response.data);
          return response.data.output_TransactionID;
        } catch (error) {
          console.log(error);
        }
      })
      .then((results) => {
        console.log("key acquired", results);
      })
      .catch(() => {
        console.log("Failed to acquire the key");
      });
  }

  //get query the status of transaction
  queryTransaction() {
    return this.getSessionId(config.keys.apiKey)
      .then(async (data) => {
        try {
          // console.log("Key acquired");
          let response = await axios({
            method: "get",
            url: config.urls.statusUrl,
            headers: {
              Accept: "application/json",
              Origin: "*",
              Authorization: "Bearer " + this.encryptKey(data.output_SessionID),
            },
            data: new dataSample.queryTranSample(
              "cR14fj",
              "asv02e5989774f7ba228d8"
            ).queryStatusDataSample(),
          });
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.log(error);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
}

const payment = new Payment(399000, "000000000002", "For shoes");

module.exports = Payment;