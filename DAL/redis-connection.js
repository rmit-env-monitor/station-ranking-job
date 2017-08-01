const config = require('config')
const redisClient = require('redis').createClient
const redis = redisClient(config.get('redis.port'), config.get('redis.ip'))

module.exports = redis