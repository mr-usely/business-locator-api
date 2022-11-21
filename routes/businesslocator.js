const express = require('express')
const router = express.Router()
const BLocator = require('../models/businesslocator')

// Getting All
router.get('/', async (req, res) => {
    try {
        const blocator = await BLocator.find()
        res.json(blocator)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Getting One
router.get('/:id', getBusinessLocator, (req, res) => {
    res.send(res.blocator)
})

// Creating One
router.post('/', async (req, res) => {
    const blocator = new BLocator({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newBLocator = await blocator.save()
        res.status(201).json(newBLocator)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Updating One
router.patch('/:id', getBusinessLocator, async (req, res) => {
    if(req.body.name != null) {
        res.blocator.name = req.body.name
    }
    if(req.body.subscribedToChannel != null) {
        res.blocator.subscribedToChannel = req.body.subscribedToChannel
    }

    try {
        const updatedBusiness = await res.blocator.save()
        res.json(updatedBusiness)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Deleting One
router.delete('/:id', getBusinessLocator, async (req, res) => {
    try {
        await res.blocator.remove()
        res.json({ message: 'Deleted Business' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

async function getBusinessLocator(req, res, next) {
    let blocator
    try {
        blocator = await BLocator.findById(req.params.id)
        if(blocator == null) {
            return res.status(404).json({ message: 'Cannot Find Business' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    res.blocator = blocator
    next()
}


module.exports = router