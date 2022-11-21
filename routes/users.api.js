const express = require('express')
const router = express.Router()
const User = require('../models/users.model')
const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
    try {
        const auth = await User.find()
        res.json(auth)
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})

// Creating user account
router.post('/create', async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)

        const checkEmail = await User.findOne({ email: req.body.email });

        if (checkEmail == null) {
            const auth = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                birthDay: req.body.birthDay,
                password: hashedPass
            })

            const newAuth = await auth.save()
            res.status(201).json(newAuth)
        } else {
            res.json({ type: 'existing', message: "User is already existing." });
        }

    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})


// Deleting user
router.delete('/delete/:id', getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({ type: 'success', message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})


// User login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (user == null) {
        return res.status(400).json({ type: 'error', message: "No user found" })
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(201).json(user)
        } else {
            res.json({ type: 'error', message: 'Not Allowed' })
        }
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }
})

// Midleware
async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find product' })
        }
    } catch (err) {
        res.status(500).json({ type: 'error', message: err.message })
    }

    res.user = user
    next()
}

module.exports = router