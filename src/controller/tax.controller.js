const taxModel = require('../model/tax.js')
const { findOneAndUpdate } = require('../user/user.js')
const userModel = require('../model/user.js')
const validator = require('../validator/validator')

// create 
const userTaxCreation = async function (req, res) {

    try {


        const userData = req.body
        console.log(userData)

        if (validator.isValidRequestBody(userData)) {

            return res.status(400).send({ status: false, msg: "please provide valid body " })
        }


        let { userId, totalSales, city, date, SGST, CGST, taxSlab, taxStatus } = userData

        if (validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "please provide valid userId" })
        }

        // more validations can be done easily like that 
        if (validator.isValid(city)) {
            return res.status(400).send({ status: false, msg: " please provide valid city " })

        }

        //checking user exist or not 
        // as well it is a taxPayer as well only 

        const userCheck = await userModel.findById(userId)
        // user validation 


        console.log(userCheck.role)

        if (!userCheck) {

            return res.status(404).send({ status: false, msg: "no such user found please check userid " })
        }

        else {
            if (userCheck.role == 'admin' || userCheck.role == 'taxAccountant') {

                return res.status(404).send({ status: false, msg: "you are not a taxpayer  " })
            }
        }

        if (validator.isValid(totalSales)) {
            return res.status(400).send({ status: false, msg: "please provide valid totalSales " })

        }

        let UT = ["Andaman and Nicobar", "Chandigarh", "Daman and Diu", "Dadar and Nagar Haveli", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep"]

        CGST = (totalSales * taxSlab) / 100
        SGST = CGST

        // that means city is in UT there SGST will be  0 
        // it will return true if yes  
        if (UT.indexOf(city) !== -1) {

            SGST = 0


        }


        let totalTax = SGST + CGST


        let modelData = {


            "userId": userId,
            "totalSales": totalSales,
            "City": city,
            "date": date,
            "SGST": SGST,
            "CGST": CGST,
            "taxSlab": taxSlab,
            "taxStatus": taxStatus,  // here we can change the taxStatus that can be done only bu taxPayer 
            "totalTax": totalTax


        }

        let createdData = await taxModel.create(modelData)

        return res.status(201).send({ status: true, data: createdData })
    }



    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })
    }
};

const getTaxDetailsByUserId = async function (req, res) {

    let userId = req.params.userId
    const userCheck = await userModel.findById(userId)

    if (!userCheck) {
        return
    }
    let userTaxes = await taxModel.find({ userId })
    console.log(userTaxes)

    return res.send(userTaxes)

}
const getTaxDetailsFiltres = async function (req, res) {

    let filters = req.query

    filters = { userId, data, taxStatus }

    if (user[role] == 'taxPayer') {

        if (userId !== decodedToken.userId) {
            return res.send("you are  not authorized to do that ")
        }

        else {
            const userDetailsByfilter = await taxModel.findById(userId) // more query here 
        }
    }

    else {

        const filteredProducts = await taxModel.find(filters)

        res.send(filteredProduct)

    }

}
const markTaxPaid = async function (req, res) {
    let userId = req.params.userId
    let newStatus = req.query.status
    let taxId = req.query.taxId
    let userCheck = await userModel.findById(userId)
    if (!userCheck) {
        return res.send('no such user Found ')
    }

    let taxIdCheck = await taxModel.findById(taxId)
    if (!taxIdCheck) {
        return res.send(' no tax record Found ')
    }

    let updated = await taxModel.findOneAndUpdate(taxId, { taxStatus: newStatus }, { new: true })

    res.send(updated)
}

const createAndEditTaxDue = async function (req, res) {

    let userId = req.params.userId
    let taxDueStatus = req.query.taxDueStatus
    let taxId = req.query.taxId

    let userCheck = await userModel.findById(userId)
    if (!userCheck) {
        return res.send('no such user Found ')
    }
    if (userCheck.role !== 'taxAccountant') {

        return res.send(' only tax accountant allowed ')

    }

    if (userCheck.taxStatus == 'paid') {
        return res.send(' tax Already paid by user ')
    }

    let taxIdCheck = await taxModel.findById(taxId)
    if (!taxIdCheck) {
        return res.send(' no tax record Found ')
    }

    let updated = await taxModel.findOneAndUpdate(taxId, { taxDue: taxDueStatus }, { new: true })

    return res.send(updated)
}

module.exports = {
    userTaxCreation, getTaxDetailsByUserId, getTaxDetailsFiltres, markTaxPaid, createAndEditTaxDue
}