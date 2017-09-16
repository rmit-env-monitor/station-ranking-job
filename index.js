const Queue = require('bull')
const config = require('config')
const express = require('express')
const Arena = require('bull-arena')

require('./DAL/mongodb-connection')
const redis = require('./DAL/redis-connection')
const stationJob = require('./jobs/station-ranking')
const constants = require('./utilities/constants')
const router = express.Router()

const stationRankingJob = new Queue(
    constants.STATION_RANKING_JOB,
    {
        redis: {
            port: config.get('redis.port'),
            host: config.get('redis.ip')
        }
    }
)

// Setup Arena for webview.
const arena = Arena({
    'queues': [{
        'name': constants.STATION_RANKING_JOB,
        'port': config.get('redis.port'),
        'host': config.get('redis.ip'),
        'hostId': 'jobs'
    }]
})
router.use('/', arena)

stationRankingJob.process((job, done) => {
    runStationRanking(job, done)
})

stationRankingJob.add(null, { repeat: { cron: '0 * * * *' } })

function runStationRanking(job, done) {
    stationJob.sortStations().then(value => {
        const data = JSON.stringify(value)
        redis.set(constants.STATION_RANKING, data)
        console.log(data)
        done()
    })
}