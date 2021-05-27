const bodyParser = require('body-parser')
const express = require('express')
const configDb = require('../../../config')

const sql = require('mysql')
const reg_router = express.Router()

reg_router.use(bodyParser.json());

//for location registrations
reg_router.post('/registration/locations', (req, res) => {
    //need to handle errors
    const { Street_Id, Street_name, Ward, District } = req.body;

    const sqlConn = sql.createConnection(configDb)
    sqlConn.connect((err) => {
        if (err) {
            res.status(500).json({ message: { err } })
        }
        else {
            //insert locations table
            const locQuery = `insert into Location (Street_Id,Street_name,Ward,District) values (${Street_Id},"${Street_name}","${Ward}","${District}")`;
            sqlConn.query(locQuery, (err, results) => {
                if (err) {
                    res.status(409).json({ message: { err } })
                    sqlConn.end()
                }
                else {
                    res.status(201).json({ message: { results } })
                }
            })
        }
    })

})

//Domestic _workers registration route
reg_router.post('/registration/domestic-worker', (req, res) => {
    const { Dom_Id, First_name, Middle_name, Last_name, Gender, birthDate, Street_name } = req.body;

    const sqlConn = sql.createConnection(configDb)

    sqlConn.connect((err) => {
        if (err) {
            res.status(500).json({ message: { err } })
        }
        else {
            //Domestic worker table
            //insert into dom worker table
            let insertDom = `insert into Domestic_Worker (Dom_Id,First_name,Middle_name,Last_name,Gender,birthDate ,location) values 
            ( ${Dom_Id},"${First_name}","${Middle_name}","${Last_name}","${Gender}","${birthDate} ","${Street_name}");`;

            sqlConn.query(insertDom, (err, result) => {
                if (err) {
                    res.status(409).json({ message: 'Failed query' })
                }
                else {
                    res.status(201).json({ message: { result } })
                }
            })
        }
    }
    )
}
);

//Referee registration route
reg_router.post('/registration/referee', (req, res) => {
    const { Ref_Id, First_name, Middle_name, Last_name, Gender, birthDate, Dom_Id, Occupation, Street_name } = req.body;

    const sqlConn = sql.createConnection(configDb)

    sqlConn.connect((err) => {
        if (err) {
            res.status(500).json({ message: { err } })
        }
        else {
            //Referee table
            //insert into Referee table
            let insertRef = `insert into Referee (Ref_Id,First_name,Middle_name,Last_name,Gender,birthDate,Dom_Id,Occupation,Location) values 
            ( ${Ref_Id},"${First_name}","${Middle_name}","${Last_name}","${Gender}","${birthDate} ",${Dom_Id},${Occupation},"${Street_name}")`;

            sqlConn.query(insertRef, (err, results) => {
                if (err) {
                    res.status(409).json({ message: err })
                }
                else {
                    res.json({ message: { results } }).status(201)
                }
            })
        }
    }
    )

})
module.exports = reg_router