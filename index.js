const cron = require('node-cron')

global.redis = require('./DAL/redis-connection')
require('./DAL/mongodb-connection')

const stationJob = require('./jobs/station-ranking')
new stationJob().getStationLatestAqi().then(value => {
    console.log(JSON.stringify(value))
})