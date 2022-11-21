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


// Get Nearby Businesses
router.get('/nearby/:lat/:lng', async (req, res) => {
    try {
        const nearby = await Business.aggregate([
            {
                '$geoNear': {
                    'near': {
                        'type': 'Point',
                        'coordinates': [
                            parseFloat(req.params.lng), parseFloat(req.params.lat)
                        ]
                    },
                    'distanceField': 'distance',
                    'maxDistance': 3000,
                    'query': {},
                    'includeLocs': 'dist.location',
                    'spherical': true
                }
            }, {
                '$limit': 10
            }
        ])

        res.json(nearby)
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})


// Get All Barangay's
router.get('/all/brgys', async (req, res) => {
    try {
        const allBrgys = await Business.aggregate([
            {
              '$project': {
                'barangay': 1
              }
            }, {
              '$group': {
                '_id': '$barangay'
              }
            },{
                '$sort': {
                  '_id': 1
                }
              }
          ])

        res.json(allBrgys)
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
                barangay: req.body.barangay,
                location: {
                    type: "Point", coordinates: [req.body.lng, req.body.lat]
                },
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

        if (req.body.lat != null && req.body.lng != null) {
            res.business.location.coordinates = [req.body.lng, req.body.lat]
        }

        if (req.body.barangay != null) {
            res.business.barangay = req.body.barangay
        }

        if (req.body.classification != null) {
            res.business.classification = req.body.classification
        }


        const updatedBusiness = await res.business.save()
        const business = await Business.find()

        if (updatedBusiness != null) {
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