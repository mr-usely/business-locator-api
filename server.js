require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())


// users api
const users = require('./routes/users.api')
app.use('/user', users)

// business api
const business = require('./routes/business.api')
app.use('/business', business)

// favorite api
const favorite = require('./routes/favorites.api')
app.use('/favorite', favorite)


app.listen(3000, () => console.log('Server Started'))