const cron = require('node-cron')

global.redis = require('./src/DAL/redis-connection')
require('./DAL/mongodb-connection')