const cron = require('node-cron')

const redis = require('./DAL/redis-connection')
require('./DAL/mongodb-connection')

const stationJob = require('./jobs/station-ranking')
const constants = require('./utilities/constants')

cron.schedule('* */1 * * *', () => {
    stationJob.sortStations().then(value => {
        const data = JSON.stringify(value)
        redis.set(constants.STATION_RANKING, data)
        console.log(data)
    })
})