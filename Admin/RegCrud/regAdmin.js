const db = require('../../Customer/RegCrud/schema')
const bodyParser = require('body-parser')
const express = require('express')

const reg_router = express.Router()
reg_router.use(bodyParser.json())

//for location registrations
reg_router.post('/registration/location', (req, res) => {
    const { streetname, District, Ward, Region } = req.body

    try {
        db.sqlize.
            db.location.create(
                {
                    streetname: streetname,
                    ward: Ward,
                    district: District,
                    region: Region
                }
            ).then((results) => {
                console.log(res)
                res.status(201).json({ message: { results } })
            }).catch((err) => {
                console.log(err)
                res.status(409).json({ msg: { err } })
            })
    } catch (error) {
        res.status(500).json({ msg: { error } })
    }
})

reg_router.post('/registration/domestic-worker', (req, res) => {
    const { firstname, middlename, lastname, gender, birthdate, ward, password, phone } = req.body;
    try {
        db.domWorker.create(
            {
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                gender: gender,
                birthdate: birthdate,
                homeLocationId: ward,
                phone: phone,
            }
        ).then((results) => {
            console.log(res)
            res.status(201).json({ message: { results } })
        }).catch((err) => {
            console.log(err)
            res.status(409).json({ msg: { err } })
        })
    } catch (error) {
        res.status(500).json({ msg: { error } })
    }

}
);


reg_router.post('/registration/customer', (req, res) => {
    const { firstname, middlename, lastname,role, gender, birthdate, ward, occupationId, DomesticworkerDomId, password, phone, email } = req.body;
    try {
        db.customer.create(
            {
                //custId: cust_Id,
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                gender: gender,
                birthdate: birthdate,
                locationId: ward,
                occupationId: occupationId,
                DomesticworkerDomId: DomesticworkerDomId,
                password: password,
                phone: phone,
                email: email,
                role:role,
                
            }
        ).then((results) => {
            console.log(res)
            res.status(201).json({ message: { results } })
        }).catch((err) => {
            console.log(err)
            res.status(409).json({ msg: { err } })
        })
    } catch (error) {
        res.status(500).json({ msg: { error } })
    }

}
);

reg_router.post('/registration/referee', (req, res) => {
    const { firstname, middlename, lastname, gender, birthdate, ward, occupationId, password, phone, email, DomesticworkerDomId, role } = req.body;

    try {
        db.referee.create(
            {
                //custId: cust_Id,
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                gender: gender,
                birthdate: birthdate,
                occupationId: occupationId,
                DomesticworkerDomId: DomesticworkerDomId,
                password: password,
                phone: phone,
                email: email,
                locationId:ward
            }
        ).then((results) => {
            console.log(res)
            res.status(201).json({ message: { results } })
        }).catch((err) => {
            console.log(err)
            res.status(409).json({ msg: { err } })
        })
    } catch (error) {
        res.status(500).json({ msg: { error } })
    }
})

reg_router.post('/registration/occupation', (req, res) => {
    const { id, occupation } = req.body;

    try {
        db.occupation.create(
            {
                id: id,
                occupation: occupation,
            }
        ).then((results) => {
            console.log(res)
            res.status(201).json({ message: { results } })
        }).catch((err) => {
            console.log(err)
            res.status(409).json({ msg: { err } })
        })
    } catch (error) {
        res.status(500).json({ msg: { error } })
    }
})
module.exports = reg_router
