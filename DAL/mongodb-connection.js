const mongoose = require('mongoose')
const config = require('config')

mongoose.connect(config.get('mongodb.url'))
mongoose.Promise = global.Promise