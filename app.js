const express = require('express')
// const crypto = require('crypto')
const dbSchema = require('./Customer/RegCrud/schema')
const regAdmin = require('./Admin/RegCrud/regAdmin')
const custReg = require('./Customer/RegCrud/custReg')
const contract = require('./Admin/History/contract')
// const customerAuntentication = require('./Admin/Authenticate/login')
const location = require('./Admin/crud/location')
const payment = require('./Admin/crud/payment')
const occupation = require('./Admin/crud/occupation')
const customerCrud = require('./Admin/crud/customer');
const refereeCrud = require('./Admin/crud/referee');
const reportCrud = require('./Admin/crud/problemReport');
const cors = require('cors');
const domWorkerCrud = require('./Admin/crud/domWorkers')
const customerAuthenticate = require('./Admin/Authenticate/login')

const app = express()
const port = process.env.PORT || 7500

app.use(cors())
app.use('/', regAdmin)
app.use('/', customerCrud)
app.use('/', refereeCrud)
app.use('/', domWorkerCrud)
app.use('/', occupation)
app.use('/', location)
app.use('/', reportCrud)
app.use('/', customerAuthenticate)
app.use('/customer', custReg)
app.use('/customer', payment)
//for both
app.use('/history', contract)

// dbSchema.sqlize
//     .query(
//         "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))"
//     )
//     .then(([results, metadata]) => {
//         console.log(results);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

app.listen(port, (err) => {
    if (err) {
        app.response.status(500).json({ message: { err } })
    }
    // crypto.randomBytes(64).toString('base64')
    console.log(`Listening at port ${port}`,);
})
