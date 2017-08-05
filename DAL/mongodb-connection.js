const mongoose = require('mongoose')
const config = require('config')

mongoose.connect(config.get('mongodb.url'), { useMongoClient: true })
mongoose.Promise = global.Promise