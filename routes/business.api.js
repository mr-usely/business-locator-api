const express = require('express')
const router = express.Router()
const Business = require('../models/business.model')


// Get all Businesses
router.get('/', async (req, res) => {
    try {
        const auth = await Business.find()
        res.json(auth)
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})

// Creating Business
router.post('/create', async (req, res) => {
    try {

        const checkName = await Business.findOne({ name: req.body.name });

        if (checkName == null) {
            const create = new Business({
                name: req.body.name,
                address: req.body.address,
                lat: req.body.lat,
                lng: req.body.lng,
                classification: req.body.classification
            })

            const createResult = await create.save()
            res.status(201).json(createResult)
        } else {
            res.json({ type: 'existing', message: "Business name is already existing." });
        }

    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})

// Updating business info
router.patch('/update/:id', getBusiness, async (req, res) => {
    try {
        if (req.body.name != null) {
            res.business.name = req.body.name
        }

        if (req.body.address != null) {
            res.business.address = req.body.address
        }

        if (req.body.lat != null) {
            res.business.lat = req.body.lat
        }

        if (req.body.lng != null) {
            res.business.lng = req.body.lng
        }

        if (req.body.classification != null) {
            res.business.classification = req.body.classification
        }


        const updatedBusiness = await res.business.save()
        const business = await Business.find()

        if (updatedBusiness != null) {
            console.log('Business info updated')
            res.json(business)
        }
    } catch (err) {
        res.status(400).json({ type: 'error', message: err.message })
    }
})


// Delete business
router.delete('/delete/:id', getBusiness, async (req, res) => {
    try {
        await res.business.remove()
        res.json({ type: 'success', message: 'Business deleted' })
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})


// Middleware
async function getBusiness(req, res, next) {
    let business
    try {
        business = await Business.findById(req.params.id)
        if (business == null) {
            return res.status(404).json({ message: 'Cannot find business' })
        }
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }

    res.business = business
    next()
}

module.exports = router