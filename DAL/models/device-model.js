const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        lat: Number,
        lng: Number,
        name: String,
        city: String,
        district: String
    },
    {
        collection: 'devices'
    }
)

module.exports = mongoose.model('devices', schema)