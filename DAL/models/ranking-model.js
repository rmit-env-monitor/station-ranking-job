const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        result: Array
    },
    {
        collection: 'rankings'
    }
)

module.exports = mongoose.model('rankings', schema)