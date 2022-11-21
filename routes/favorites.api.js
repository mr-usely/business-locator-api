const express = require('express')
const router = express.Router()
const Favorites = require('../models/favorites.model')
const Business = require('../models/business.model')

// Add to Favorites
router.post('/add', async (req, res) => {
    try {
        const business = await Business.findById(req.body.businessId)

        const favorites = new Favorites({
            name: business.name,
            address: business.address,
            lat: business.lat,
            lng: business.lng,
            classification: business.classification,
            user: req.body.userId
        })

        const createResult = await favorites.save()
        res.status(201).json(createResult)
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})


// Delete business
router.delete('/delete/:id', getFavorites, async (req, res) => {
    try {
        await res.favorites.remove()
        res.json({ type: 'success', message: 'Favorite deleted' })
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})


// Middleware
async function getFavorites(req, res, next) {
    let favorites
    try {
        favorites = await Favorites.findById(req.params.id)
        if (favorites == null) {
            return res.status(404).json({ message: 'Cannot find favorite' })
        }
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }

    res.favorites = favorites
    next()
}

module.exports = router